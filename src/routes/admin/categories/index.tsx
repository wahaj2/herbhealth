import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Plus, Trash2, Pencil, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Category = { id: string; name: string; slug: string; image_path: string | null };

function getImageUrl(path: string) {
  const url = import.meta.env["VITE_SUPABASE_URL"] as string;
  return `${url}/storage/v1/object/public/product-images/${path}`;
}

const fetchCategories = createServerFn({ method: "GET" }).handler(async () => {
  const { createServerSupabase } = await import("@/lib/supabase-server");
  const db = createServerSupabase();
  const { data } = await db
    .from("categories")
    .select("id, name, slug, image_path")
    .order("name");
  return (data ?? []) as Category[];
});

const uploadCategoryImage = createServerFn({ method: "POST" })
  .validator(
    z.object({
      fileName: z.string(),
      fileBase64: z.string(),
      mimeType: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(data.mimeType)) throw new Error("Only JPEG, PNG and WebP are allowed");
    const bytes = Buffer.from(data.fileBase64, "base64");
    if (bytes.length > 5 * 1024 * 1024) throw new Error("Image must be under 5MB");

    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();
    const path = `categories/${Date.now()}-${data.fileName}`;
    const { error } = await db.storage
      .from("product-images")
      .upload(path, bytes, { contentType: data.mimeType, upsert: false });
    if (error) throw new Error(error.message);
    return { path };
  });

const createCategory = createServerFn({ method: "POST" })
  .validator(
    z.object({ name: z.string().min(2), slug: z.string().min(2), imagePath: z.string().nullable() }),
  )
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();
    const { data: created, error } = await db
      .from("categories")
      .insert({ name: data.name, slug: data.slug, image_path: data.imagePath })
      .select("id, name, slug, image_path")
      .single();
    if (error) throw new Error(error.message);
    return created as Category;
  });

const updateCategory = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string(),
      name: z.string().min(2),
      slug: z.string().min(2),
      imagePath: z.string().nullable(),
      oldImagePath: z.string().nullable(),
    }),
  )
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();
    const { data: updated, error } = await db
      .from("categories")
      .update({ name: data.name, slug: data.slug, image_path: data.imagePath })
      .eq("id", data.id)
      .select("id, name, slug, image_path")
      .single();
    if (error) throw new Error(error.message);
    if (data.oldImagePath && data.oldImagePath !== data.imagePath) {
      await db.storage.from("product-images").remove([data.oldImagePath]);
    }
    return updated as Category;
  });

// Deletes a category AND every product in it (FK cascade from the migration
// above), plus cleans up every associated file in storage — the category's
// own image and every image belonging to its products.
const deleteCategory = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();

    const [{ data: category }, { data: products }] = await Promise.all([
      db.from("categories").select("image_path").eq("id", data.id).single(),
      db.from("products").select("id").eq("category_id", data.id),
    ]);

    const productIds = (products ?? []).map((p) => p.id);
    const pathsToRemove: string[] = [];
    if (category?.image_path) pathsToRemove.push(category.image_path);

    if (productIds.length > 0) {
      const { data: images } = await db
        .from("product_images")
        .select("storage_path")
        .in("product_id", productIds);
      for (const img of images ?? []) pathsToRemove.push(img.storage_path);
    }

    if (pathsToRemove.length > 0) {
      await db.storage.from("product-images").remove(pathsToRemove);
    }

    // Cascades to products -> product_images automatically (FK ON DELETE CASCADE).
    const { error } = await db.from("categories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { deletedProducts: productIds.length };
  });

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]!);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const Route = createFileRoute("/admin/categories/")({
  loader: () => fetchCategories(),
  head: () => ({ meta: [{ title: "Categories — HerbHealth Admin" }] }),
  component: AdminCategories,
});

function AdminCategories() {
  const initial = Route.useLoaderData();
  const [categories, setCategories] = useState(initial);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);

  const autoSlug = (n: string) =>
    n
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const pickFile = (
    f: File | null,
    setF: (f: File | null) => void,
    setP: (p: string | null) => void,
  ) => {
    if (!f) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(f.type)) {
      toast.error("Only JPEG/PNG/WebP allowed");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setF(f);
    setP(URL.createObjectURL(f));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    setSaving(true);
    try {
      let imagePath: string | null = null;
      if (file) {
        const base64 = await fileToBase64(file);
        const { path } = await uploadCategoryImage({
          data: { fileName: file.name, fileBase64: base64, mimeType: file.type },
        });
        imagePath = path;
      }
      const created = await createCategory({
        data: { name: name.trim(), slug: slug.trim(), imagePath },
      });
      setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setName("");
      setSlug("");
      setFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      toast.success("Category created");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to create category");
    }
    setSaving(false);
  };

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setEditName(c.name);
    setEditSlug(c.slug);
    setEditFile(null);
    setEditPreview(c.image_path ? getImageUrl(c.image_path) : null);
  };

  const saveEdit = async (c: Category) => {
    setSaving(true);
    try {
      let imagePath: string | null = c.image_path;
      if (editFile) {
        const base64 = await fileToBase64(editFile);
        const { path } = await uploadCategoryImage({
          data: { fileName: editFile.name, fileBase64: base64, mimeType: editFile.type },
        });
        imagePath = path;
      }
      const updated = await updateCategory({
        data: {
          id: c.id,
          name: editName.trim(),
          slug: editSlug.trim(),
          imagePath,
          oldImagePath: editFile ? c.image_path : null,
        },
      });
      setCategories((prev) =>
        prev.map((cat) => (cat.id === c.id ? updated : cat)).sort((a, b) => a.name.localeCompare(b.name)),
      );
      setEditingId(null);
      toast.success("Category updated");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to update category");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, catName: string) => {
    if (
      !confirm(
        `Delete category "${catName}"? This will permanently delete ALL products in this category and their photos. This cannot be undone.`,
      )
    )
      return;
    try {
      const { deletedProducts } = await deleteCategory({ data: { id } });
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success(
        deletedProducts > 0
          ? `Category and ${deletedProducts} product${deletedProducts === 1 ? "" : "s"} deleted`
          : "Category deleted",
      );
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to delete category");
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-display text-2xl mb-8">Categories</h1>

      <form onSubmit={handleAdd} className="border border-border bg-card p-5 mb-8 space-y-4">
        <h2 className="font-display text-lg">Add Category</h2>
        <div>
          <Label>Name</Label>
          <Input
            className="mt-2 rounded-none"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(autoSlug(e.target.value));
            }}
            placeholder="e.g. Mini Bags"
          />
        </div>
        <div>
          <Label>Slug</Label>
          <Input
            className="mt-2 rounded-none"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. mini-bags"
          />
        </div>
        <div>
          <Label>Category Image</Label>
          <div className="mt-2 flex items-center gap-4">
            {preview && (
              <div className="relative size-20 shrink-0 overflow-hidden border border-border">
                <img src={preview} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="absolute right-0 top-0 bg-background/80 p-0.5"
                >
                  <X className="size-3" />
                </button>
              </div>
            )}
            <label className="flex cursor-pointer items-center gap-2 border border-dashed border-border px-4 py-2 text-xs text-muted-foreground hover:border-gold hover:text-foreground">
              <Upload className="size-4" />
              {preview ? "Replace image" : "Upload image"}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0] ?? null, setFile, setPreview)}
              />
            </label>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            JPEG/PNG/WebP, up to 5MB. Shown on the homepage category tiles.
          </p>
        </div>
        <Button type="submit" variant="hero" disabled={saving}>
          <Plus className="size-4 mr-2" /> {saving ? "Adding…" : "Add Category"}
        </Button>
      </form>

      <div className="border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((c) =>
              editingId === c.id ? (
                <tr key={c.id} className="bg-card">
                  <td className="px-4 py-3">
                    <div className="relative size-12 overflow-hidden border border-border">
                      {editPreview ? (
                        <img src={editPreview} alt="" className="size-full object-cover" />
                      ) : (
                        <div className="size-full bg-secondary/40" />
                      )}
                    </div>
                    <label className="mt-1 block cursor-pointer text-[10px] text-gold underline">
                      Change
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => pickFile(e.target.files?.[0] ?? null, setEditFile, setEditPreview)}
                      />
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <Input className="rounded-none" value={editName} onChange={(e) => setEditName(e.target.value)} />
                  </td>
                  <td className="px-4 py-3">
                    <Input className="rounded-none" value={editSlug} onChange={(e) => setEditSlug(e.target.value)} />
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button size="sm" variant="hero" disabled={saving} onClick={() => saveEdit(c)}>
                      Save
                    </Button>
                    <Button size="sm" variant="quiet" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </td>
                </tr>
              ) : (
                <tr key={c.id} className="bg-card">
                  <td className="px-4 py-3">
                    <div className="size-12 overflow-hidden border border-border bg-secondary/40">
                      {c.image_path && (
                        <img src={getImageUrl(c.image_path)} alt="" className="size-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <button onClick={() => startEdit(c)} className="p-1 text-muted-foreground hover:text-gold">
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ),
            )}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}