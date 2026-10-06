import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { X, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { suggestProductSku, suggestVariantSku } from "@/lib/sku";

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  sku: z.string().optional(),
  price: z.coerce.number().positive(),
  compare_at_price: z.coerce.number().positive().optional().or(z.literal("")),
  category_id: z.string().optional(),
  material: z.string().optional(),
  color: z.string().optional(),
  sizes: z.string().optional(), // comma-separated
  stock_status: z.enum(["in", "low", "out"]),
  stock_quantity: z.coerce.number().int().min(0).default(0),
  is_bestseller: z.boolean().default(false),
  is_active: z.boolean().default(true),
  short_description: z.string().optional(),
  description: z.string().optional(),
  care_instructions: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export type Category = { id: string; name: string };

export type ExistingImage = {
  id: string;
  storage_path: string;
  sort_order: number;
};

export type ExistingVariant = {
  id: string;
  color_name: string;
  color_hex: string | null;
  sku: string | null;
  image_path: string | null;
  stock_quantity: number | null;
  sort_order: number;
};

// Server fn: upsert product
export const upsertProduct = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().optional(),
      values: productSchema,
      imagePaths: z.array(z.string()),
      deletedImageIds: z.array(z.string()),
    }),
  )
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();

    const sizes = data.values.sizes
      ? data.values.sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : null;

    const clientSku = data.values.sku?.trim();

    const payload = {
      slug: data.values.slug,
      name: data.values.name,
      price: data.values.price,
      compare_at_price: data.values.compare_at_price || null,
      category_id: data.values.category_id || null,
      material: data.values.material || null,
      color: data.values.color || null,
      sizes,
      stock_status: data.values.stock_status,
      stock_quantity: data.values.stock_quantity,
      is_bestseller: data.values.is_bestseller,
      is_active: data.values.is_active,
      short_description: data.values.short_description || null,
      description: data.values.description || null,
      care_instructions: data.values.care_instructions || null,
    };

    let productId = data.id;

    if (productId) {
      const { error } = await db
        .from("products")
        .update({ ...payload, ...(clientSku ? { sku: clientSku } : {}) })
        .eq("id", productId);
      if (error) throw new Error(error.message);
    } else {
      const { data: created, error } = await db
        .from("products")
        .insert({ ...payload, sku: clientSku || null })
        .select("id, sku")
        .single();
      if (error) throw new Error(error.message);
      productId = created.id;

      // Safety net: if the admin left SKU blank, generate one now that we
      // know the new product's id (used for the uniqueness suffix).
      if (!created.sku) {
        const { suggestProductSku: suggest } = await import("@/lib/sku");
        const fallback = `${suggest(undefined, data.values.name)}-${productId.replace(/-/g, "").slice(0, 4).toUpperCase()}`;
        await db.from("products").update({ sku: fallback }).eq("id", productId);
      }
    }

    // Delete removed images
    if (data.deletedImageIds.length > 0) {
      await db.from("product_images").delete().in("id", data.deletedImageIds);
    }

    // Insert new image paths
    if (data.imagePaths.length > 0) {
      const { data: existing } = await db
        .from("product_images")
        .select("sort_order")
        .eq("product_id", productId)
        .order("sort_order", { ascending: false })
        .limit(1);
      const baseOrder = existing?.[0]?.sort_order ?? -1;
      const rows = data.imagePaths.map((path, i) => ({
        product_id: productId,
        storage_path: path,
        sort_order: baseOrder + 1 + i,
      }));
      const { error } = await db.from("product_images").insert(rows);
      if (error) throw new Error(error.message);
    }

    return { id: productId };
  });

// Server fn: upload image to Supabase storage (used for both product photos
// and variant photos)
export const uploadProductImage = createServerFn({ method: "POST" })
  .validator(
    z.object({
      productSlug: z.string(),
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
    const path = `products/${data.productSlug}/${Date.now()}-${data.fileName}`;
    const { error } = await db.storage
      .from("product-images")
      .upload(path, bytes, { contentType: data.mimeType, upsert: false });
    if (error) throw new Error(error.message);
    return { path };
  });

// Server fn: upsert color variants for a product
export const upsertProductVariants = createServerFn({ method: "POST" })
  .validator(
    z.object({
      productId: z.string(),
      variants: z.array(
        z.object({
          id: z.string().optional(),
          colorName: z.string().min(1),
          colorHex: z.string().optional(),
          sku: z.string().optional(),
          imagePath: z.string().nullable(),
          stockQuantity: z.number().int().min(0).nullable(),
        }),
      ),
      deletedIds: z.array(z.string()),
      replacedImagePaths: z.array(z.string()),
    }),
  )
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const { suggestVariantSku } = await import("@/lib/sku");
    const db = createServerSupabase();

    const { data: productRow } = await db
      .from("products")
      .select("sku")
      .eq("id", data.productId)
      .single();
    const productSkuPrefix = productRow?.sku ?? "SKU";

    const pathsToRemove = [...data.replacedImagePaths];

    if (data.deletedIds.length > 0) {
      const { data: toDelete } = await db
        .from("product_variants")
        .select("image_path")
        .in("id", data.deletedIds);
      for (const v of toDelete ?? []) if (v.image_path) pathsToRemove.push(v.image_path);
      await db.from("product_variants").delete().in("id", data.deletedIds);
    }

    if (pathsToRemove.length > 0) {
      await db.storage.from("product-images").remove(pathsToRemove);
    }

    for (const [i, v] of data.variants.entries()) {
      const row = {
        product_id: data.productId,
        color_name: v.colorName,
        color_hex: v.colorHex || null,
        sku: v.sku?.trim() || null,
        image_path: v.imagePath,
        stock_quantity: v.stockQuantity,
        sort_order: i,
      };
      if (v.id) {
        const { error } = await db.from("product_variants").update(row).eq("id", v.id);
        if (error) throw new Error(error.message);
      } else {
        const { data: created, error } = await db
          .from("product_variants")
          .insert(row)
          .select("id, sku")
          .single();
        if (error) throw new Error(error.message);
        if (!created.sku) {
          const fallback = `${suggestVariantSku(productSkuPrefix, v.colorName)}-${created.id.replace(/-/g, "").slice(0, 4).toUpperCase()}`;
          await db.from("product_variants").update({ sku: fallback }).eq("id", created.id);
        }
      }
    }
  });

function getImageUrl(path: string) {
  const url = import.meta.env["VITE_SUPABASE_URL"] as string;
  return `${url}/storage/v1/object/public/product-images/${path}`;
}

type VariantRow = {
  id?: string;
  colorName: string;
  colorHex: string;
  sku: string;
  stockQuantity: string;
  existingImagePath: string | null;
  newFile?: File;
  preview?: string;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ProductForm({
  defaultValues,
  productId,
  existingImages = [],
  existingVariants = [],
  categories,
}: {
  defaultValues?: Partial<ProductFormValues>;
  productId?: string;
  existingImages?: ExistingImage[];
  existingVariants?: ExistingVariant[];
  categories: Category[];
}) {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ExistingImage[]>(
    existingImages.sort((a, b) => a.sort_order - b.sort_order),
  );
  const [newFiles, setNewFiles] = useState<{ file: File; preview: string }[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [variants, setVariants] = useState<VariantRow[]>(
    existingVariants
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((v) => ({
        id: v.id,
        colorName: v.color_name,
        colorHex: v.color_hex ?? "#1a1a1a",
        sku: v.sku ?? "",
        stockQuantity: v.stock_quantity === null ? "" : String(v.stock_quantity),
        existingImagePath: v.image_path,
        preview: v.image_path ? getImageUrl(v.image_path) : undefined,
      })),
  );
  const [deletedVariantIds, setDeletedVariantIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema) as unknown as Resolver<ProductFormValues>,
    defaultValues: {
      stock_status: "in",
      stock_quantity: 0,
      is_bestseller: false,
      is_active: true,
      ...defaultValues,
    },
  });

  const nameValue = watch("name");
  const skuValue = watch("sku");
  const categoryIdValue = watch("category_id");

  const autoSlug = () => {
    setValue(
      "slug",
      nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    );
  };

  // Only fills the SKU field if it's currently empty, so it never
  // overwrites something the admin already typed or a previously-saved SKU.
  const autoSku = () => {
    if (skuValue?.trim()) return;
    const categoryName = categories.find((c) => c.id === categoryIdValue)?.name;
    const suggestion = suggestProductSku(categoryName, nameValue || "");
    if (suggestion) setValue("sku", suggestion);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const MAX = 20;
    const remaining = MAX - images.length - newFiles.length;
    const toAdd = Array.from(files).slice(0, remaining);
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    for (const f of toAdd) {
      if (!allowed.includes(f.type)) {
        toast.error(`${f.name}: only JPEG/PNG/WebP allowed`);
        continue;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name}: must be under 5MB`);
        continue;
      }
      setNewFiles((prev) => [...prev, { file: f, preview: URL.createObjectURL(f) }]);
    }
  };

  const removeExisting = (id: string) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
    setDeletedIds((prev) => [...prev, id]);
  };

  const removeNew = (idx: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const addVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      { colorName: "", colorHex: "#1a1a1a", sku: "", stockQuantity: "", existingImagePath: null },
    ]);
  };

  const removeVariantRow = (idx: number) => {
    setVariants((prev) => {
      const row = prev[idx];
      if (row?.id) setDeletedVariantIds((d) => [...d, row.id!]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const updateVariant = (idx: number, patch: Partial<VariantRow>) => {
    setVariants((prev) => prev.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  };

  const suggestVariantSkuFor = (idx: number) => {
    const v = variants[idx];
    if (!v?.colorName.trim()) {
      toast.error("Enter a color name first");
      return;
    }
    const prefix = skuValue?.trim() || "SKU";
    updateVariant(idx, { sku: suggestVariantSku(prefix, v.colorName) });
  };

  const pickVariantImage = (idx: number, file: File | null) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPEG/PNG/WebP allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    updateVariant(idx, { newFile: file, preview: URL.createObjectURL(file) });
  };

  const clearVariantImage = (idx: number) => {
    updateVariant(idx, { newFile: undefined, existingImagePath: null, preview: undefined });
  };

  const onSubmit = async (values: ProductFormValues) => {
    setUploading(true);
    const uploadedPaths: string[] = [];
    try {
      for (const { file } of newFiles) {
        const base64 = await fileToBase64(file);
        const { path } = await uploadProductImage({
          data: { productSlug: values.slug, fileName: file.name, fileBase64: base64, mimeType: file.type },
        });
        uploadedPaths.push(path);
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Image upload failed");
      setUploading(false);
      return;
    }

    const replacedImagePaths: string[] = [];
    const resolvedVariants: {
      id?: string;
      colorName: string;
      colorHex?: string;
      sku?: string;
      imagePath: string | null;
      stockQuantity: number | null;
    }[] = [];
    try {
      for (const v of variants) {
        if (!v.colorName.trim()) continue;
        let imagePath = v.existingImagePath;
        if (v.newFile) {
          const base64 = await fileToBase64(v.newFile);
          const { path } = await uploadProductImage({
            data: { productSlug: values.slug, fileName: v.newFile.name, fileBase64: base64, mimeType: v.newFile.type },
          });
          if (v.existingImagePath) replacedImagePaths.push(v.existingImagePath);
          imagePath = path;
        }
        resolvedVariants.push({
          id: v.id,
          colorName: v.colorName.trim(),
          colorHex: v.colorHex,
          sku: v.sku.trim() || undefined,
          imagePath,
          stockQuantity: v.stockQuantity === "" ? null : Number(v.stockQuantity),
        });
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Variant image upload failed");
      setUploading(false);
      return;
    }
    setUploading(false);

    try {
      const { id: savedProductId } = await upsertProduct({
        data: { id: productId, values, imagePaths: uploadedPaths, deletedImageIds: deletedIds },
      });

      await upsertProductVariants({
        data: {
          productId: savedProductId,
          variants: resolvedVariants,
          deletedIds: deletedVariantIds,
          replacedImagePaths,
        },
      });

      toast.success(productId ? "Product updated" : "Product created");
      navigate({ to: "/admin/products" });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      {/* Basic info */}
      <section className="space-y-4">
        <h2 className="font-display text-lg">Basic Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Name *</Label>
            <Input
              className="mt-2 rounded-none"
              {...register("name")}
              onBlur={() => {
                autoSlug();
                autoSku();
              }}
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div>
            <Label>Slug *</Label>
            <Input className="mt-2 rounded-none" {...register("slug")} />
            {errors.slug && <p className="mt-1 text-xs text-destructive">{errors.slug.message}</p>}
          </div>
        </div>
        <div>
          <Label>
            SKU <span className="text-muted-foreground font-normal">(admin-only, never shown on the site)</span>
          </Label>
          <Input
            className="mt-2 rounded-none font-mono uppercase"
            placeholder="Auto-filled from category + name — edit freely"
            {...register("sku")}
          />
        </div>
        <div>
          <Label>Short Description</Label>
          <Input className="mt-2 rounded-none" {...register("short_description")} />
        </div>
        <div>
          <Label>Full Description</Label>
          <Textarea rows={4} className="mt-2 rounded-none" {...register("description")} />
        </div>
        <div>
          <Label>Care Instructions</Label>
          <Textarea rows={2} className="mt-2 rounded-none" {...register("care_instructions")} />
        </div>
      </section>

      {/* Pricing */}
      <section className="space-y-4">
        <h2 className="font-display text-lg">Pricing (PKR)</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Price *</Label>
            <Input type="number" className="mt-2 rounded-none" {...register("price")} />
            {errors.price && <p className="mt-1 text-xs text-destructive">{errors.price.message}</p>}
          </div>
          <div>
            <Label>Compare-at Price</Label>
            <Input type="number" className="mt-2 rounded-none" {...register("compare_at_price")} />
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="space-y-4">
        <h2 className="font-display text-lg">Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Category</Label>
            <Controller
              control={control}
              name="category_id"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={(v) => {
                    field.onChange(v);
                    autoSku();
                  }}
                >
                  <SelectTrigger className="mt-2 rounded-none">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label>Form</Label>
            <Input className="mt-2 rounded-none" {...register("material")} />
          </div>
          <div>
            <Label>Default Variant</Label>
            <Input
              className="mt-2 rounded-none"
              {...register("color")}
              placeholder="Used if no variants are added below"
            />
          </div>
          <div>
            <Label>Sizes (comma-separated)</Label>
            <Input className="mt-2 rounded-none" placeholder="Standard, Large" {...register("sizes")} />
          </div>
        </div>
      </section>

      {/* Stock */}
      <section className="space-y-4">
        <h2 className="font-display text-lg">Stock</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Stock Status *</Label>
            <Controller
              control={control}
              name="stock_status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-2 rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">In Stock</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="out">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label>Quantity</Label>
            <Input type="number" className="mt-2 rounded-none" {...register("stock_quantity")} />
          </div>
        </div>
      </section>

      {/* Flags */}
      <section className="space-y-4">
        <h2 className="font-display text-lg">Visibility</h2>
        <div className="flex flex-col gap-4">
          <Controller
            control={control}
            name="is_active"
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <Switch checked={field.value} onCheckedChange={field.onChange} />
                <Label>Active (visible on storefront)</Label>
              </div>
            )}
          />
          <Controller
            control={control}
            name="is_bestseller"
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <Switch checked={field.value} onCheckedChange={field.onChange} />
                <Label>Mark as Bestseller</Label>
              </div>
            )}
          />
        </div>
      </section>

      {/* Images */}
      <section className="space-y-4">
        <h2 className="font-display text-lg">Images (max 20, JPEG/PNG/WebP, 5MB each)</h2>
        <div className="flex flex-wrap gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative size-24 border border-border">
              <img src={getImageUrl(img.storage_path)} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => removeExisting(img.id)}
                className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-background/90 hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
          {newFiles.map((f, i) => (
            <div key={i} className="relative size-24 border border-gold/50">
              <img src={f.preview} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => removeNew(i)}
                className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-background/90 hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
          {images.length + newFiles.length < 20 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="size-24 border border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-gold hover:text-gold transition-colors"
            >
              <Upload className="size-5" />
              <span className="text-[10px]">Add</span>
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </section>

      {/* Product Variants */}
      <section className="space-y-4">
        <h2 className="font-display text-lg">Product Variants</h2>
        <p className="text-xs text-muted-foreground">
          Optional. Add a row per variant the customer can pick on the product page. Leave empty
          to
          keep this a single-variant product using the "Default Variant" field above.
        </p>
        <div className="space-y-4">
          {variants.map((v, idx) => (
            <div key={idx} className="flex flex-wrap items-start gap-3 border border-border bg-card p-4">
              <div className="relative size-16 shrink-0 overflow-hidden border border-border">
                {v.preview ? (
                  <img src={v.preview} alt="" className="size-full object-cover" />
                ) : (
                  <div className="size-full bg-secondary/40" />
                )}
                <label className="absolute inset-x-0 bottom-0 cursor-pointer bg-background/90 py-0.5 text-center text-[9px] text-gold">
                  {v.preview ? "Change" : "Photo"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => pickVariantImage(idx, e.target.files?.[0] ?? null)}
                  />
                </label>
                {v.preview && (
                  <button
                    type="button"
                    onClick={() => clearVariantImage(idx)}
                    className="absolute right-0 top-0 bg-background/90 p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>

              <div className="min-w-[140px] flex-1">
                <Label className="text-xs">Color name</Label>
                <Input
                  className="mt-1 rounded-none"
                  placeholder="e.g. Midnight Black"
                  value={v.colorName}
                  onChange={(e) => updateVariant(idx, { colorName: e.target.value })}
                />
              </div>

              <div className="w-28">
                <Label className="text-xs">Swatch color</Label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={v.colorHex}
                    onChange={(e) => updateVariant(idx, { colorHex: e.target.value })}
                    className="size-9 shrink-0 cursor-pointer border border-border p-0"
                  />
                  <Input
                    className="rounded-none text-xs"
                    value={v.colorHex}
                    onChange={(e) => updateVariant(idx, { colorHex: e.target.value })}
                  />
                </div>
              </div>

              <div className="w-36">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">SKU</Label>
                  <button
                    type="button"
                    onClick={() => suggestVariantSkuFor(idx)}
                    className="text-[10px] text-gold underline"
                  >
                    Suggest
                  </button>
                </div>
                <Input
                  className="mt-1 rounded-none font-mono text-xs uppercase"
                  placeholder="—"
                  value={v.sku}
                  onChange={(e) => updateVariant(idx, { sku: e.target.value })}
                />
              </div>

              <div className="w-24">
                <Label className="text-xs">Stock (optional)</Label>
                <Input
                  type="number"
                  min={0}
                  className="mt-1 rounded-none"
                  placeholder="—"
                  value={v.stockQuantity}
                  onChange={(e) => updateVariant(idx, { stockQuantity: e.target.value })}
                />
              </div>

              <button
                type="button"
                onClick={() => removeVariantRow(idx)}
                className="mt-6 p-1 text-muted-foreground hover:text-destructive"
                aria-label="Remove color"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <Button type="button" variant="quiet" onClick={addVariantRow}>
          + Add Color
        </Button>
      </section>

      <div className="flex gap-3">
        <Button type="submit" variant="hero" disabled={isSubmitting || uploading}>
          {isSubmitting || uploading ? "Saving…" : productId ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="quiet" onClick={() => navigate({ to: "/admin/products" })}>
          Cancel
        </Button>
      </div>
    </form>
  );
}