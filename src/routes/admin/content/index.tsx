import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type ContentMap = Record<string, string>;

function getImageUrl(path: string) {
  const url = import.meta.env["VITE_SUPABASE_URL"] as string;
  return `${url}/storage/v1/object/public/product-images/${path}`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const fetchContent = createServerFn({ method: "GET" }).handler(async () => {
  const { createServerSupabase } = await import("@/lib/supabase-server");
  const db = createServerSupabase();
  const { data } = await db.from("site_content").select("key, value");
  const map: ContentMap = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map;
});

const saveContent = createServerFn({ method: "POST" })
  .validator(z.object({ entries: z.record(z.string(), z.string()) }))
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();
    const rows = Object.entries(data.entries).map(([key, value]) => ({ key, value }));
    const { error } = await db.from("site_content").upsert(rows, { onConflict: "key" });
    if (error) throw new Error(error.message);
  });

// Uploads the homepage hero/banner image — stored in the same public
// "product-images" bucket under a "content/" prefix, same pattern as
// category photos.
const uploadContentImage = createServerFn({ method: "POST" })
  .validator(z.object({ fileName: z.string(), fileBase64: z.string(), mimeType: z.string() }))
  .handler(async ({ data }) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(data.mimeType)) throw new Error("Only JPEG, PNG and WebP are allowed");
    const bytes = Buffer.from(data.fileBase64, "base64");
    if (bytes.length > 8 * 1024 * 1024) throw new Error("Image must be under 8MB");

    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();
    const path = `content/${Date.now()}-${data.fileName}`;
    const { error } = await db.storage
      .from("product-images")
      .upload(path, bytes, { contentType: data.mimeType, upsert: false });
    if (error) throw new Error(error.message);
    return { path };
  });

export const Route = createFileRoute("/admin/content/")({
  loader: () => fetchContent(),
  head: () => ({ meta: [{ title: "Content & Offers — HerbHealth Admin" }] }),
  component: AdminContent,
});

const FIELDS: { key: string; label: string; type: "text" | "textarea" }[] = [
  { key: "hero_eyebrow", label: "Homepage hero — small tagline above the title", type: "text" },
  { key: "hero_title", label: "Homepage hero — main title", type: "text" },
  { key: "hero_subtitle", label: "Homepage hero — subtitle paragraph", type: "textarea" },
  { key: "promo_banner_text", label: "Site-wide promo banner text (leave blank to hide)", type: "text" },
  { key: "offer_code", label: "Newsletter / exit-offer discount code", type: "text" },
  {
    key: "offer_discount_text",
    label: "Newsletter / exit-offer headline (e.g. '10% off your first order')",
    type: "text",
  },
  { key: "newsletter_heading", label: "Newsletter section heading", type: "text" },
  { key: "newsletter_subtext", label: "Newsletter section subtext", type: "textarea" },
];

function AdminContent() {
  const initial = Route.useLoaderData();
  const [values, setValues] = useState<ContentMap>(initial);
  const [bannerEnabled, setBannerEnabled] = useState(initial["promo_banner_enabled"] === "true");
  const [saving, setSaving] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(
    initial["hero_image_path"] ? getImageUrl(initial["hero_image_path"]) : null,
  );
  const [uploadingHero, setUploadingHero] = useState(false);
  const heroFileRef = useRef<HTMLInputElement>(null);

  const set = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  const pickHeroImage = (file: File | null) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPEG/PNG/WebP allowed");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8MB");
      return;
    }
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  };

  const clearHeroImage = () => {
    setHeroFile(null);
    setHeroPreview(null);
    set("hero_image_path", "");
    if (heroFileRef.current) heroFileRef.current.value = "";
  };

  const handleSave = async () => {
    setSaving(true);
    setUploadingHero(true);
    try {
      let heroImagePath = values["hero_image_path"] ?? "";
      if (heroFile) {
        const base64 = await fileToBase64(heroFile);
        const { path } = await uploadContentImage({
          data: { fileName: heroFile.name, fileBase64: base64, mimeType: heroFile.type },
        });
        heroImagePath = path;
      }
      setUploadingHero(false);

      await saveContent({
        data: {
          entries: {
            ...values,
            hero_image_path: heroImagePath,
            promo_banner_enabled: String(bannerEnabled),
          },
        },
      });
      setHeroFile(null);
      toast.success("Content saved");
    } catch (e: unknown) {
      setUploadingHero(false);
      toast.error(e instanceof Error ? e.message : "Failed to save content");
    }
    setSaving(false);
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-display text-2xl mb-2">Content &amp; Offers</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Edit homepage copy and the newsletter/exit-intent offer without touching code.
      </p>

      <div className="space-y-6 border border-border bg-card p-6">
        <div className="border-b border-border pb-6">
          <Label>Homepage Hero / Slider Image</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Shown at the top of the homepage. If nothing is uploaded here, the site falls back to
            its current default image automatically.
          </p>
          <div className="mt-3 flex items-center gap-4">
            {heroPreview ? (
              <div className="relative h-24 w-40 overflow-hidden border border-border">
                <img src={heroPreview} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={clearHeroImage}
                  className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-background/90 hover:text-destructive"
                  title="Remove — reverts to the default image"
                >
                  <X className="size-3" />
                </button>
              </div>
            ) : (
              <div className="grid h-24 w-40 place-items-center border border-dashed border-border text-[10px] text-muted-foreground">
                Using default
              </div>
            )}
            <label className="flex cursor-pointer items-center gap-2 border border-dashed border-border px-4 py-2 text-xs text-muted-foreground hover:border-gold hover:text-foreground">
              <Upload className="size-4" />
              {heroPreview ? "Replace image" : "Upload image"}
              <input
                ref={heroFileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => pickHeroImage(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <Label>Show site-wide promo banner</Label>
            <p className="text-xs text-muted-foreground">Displays under the header when on.</p>
          </div>
          <Switch checked={bannerEnabled} onCheckedChange={setBannerEnabled} />
        </div>

        {FIELDS.map((f) => (
          <div key={f.key}>
            <Label>{f.label}</Label>
            {f.type === "textarea" ? (
              <Textarea
                className="mt-2 rounded-none"
                rows={3}
                value={values[f.key] ?? ""}
                onChange={(e) => set(f.key, e.target.value)}
              />
            ) : (
              <Input
                className="mt-2 rounded-none"
                value={values[f.key] ?? ""}
                onChange={(e) => set(f.key, e.target.value)}
              />
            )}
          </div>
        ))}

        <Button variant="hero" onClick={handleSave} disabled={saving}>
          {saving ? (uploadingHero ? "Uploading image…" : "Saving…") : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}