import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/data/products";
import { toast } from "sonner";

type DBProduct = {
  id: string;
  slug: string;
  name: string;
  sku: string | null;
  price: number;
  stock_status: string;
  is_active: boolean;
  category: { name: string } | null;
  product_images: { storage_path: string; sort_order: number }[];
};

const fetchProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { createServerSupabase } = await import("@/lib/supabase-server");
  const db = createServerSupabase();
  const { data, error } = await db
    .from("products")
    .select(
      "id, slug, name, sku, price, stock_status, is_active, category:categories(name), product_images(storage_path, sort_order)",
    )
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as DBProduct[];
});

const toggleActive = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), is_active: z.boolean() }))
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();
    const { error } = await db
      .from("products")
      .update({ is_active: data.is_active })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
  });

// Permanently deletes a product: removes its row, cleans up every photo
// (product photos + any color-variant photos) from storage, and relies on
// FK cascades for product_images/product_variants. order_items keeps its
// snapshot product_name/sku and just loses the product_id link (ON DELETE
// SET NULL), so past orders stay intact.
const deleteProductPermanently = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();

    const [{ data: images }, { data: variants }] = await Promise.all([
      db.from("product_images").select("storage_path").eq("product_id", data.id),
      db.from("product_variants").select("image_path").eq("product_id", data.id),
    ]);

    const paths = [
      ...(images ?? []).map((i) => i.storage_path),
      ...(variants ?? []).map((v) => v.image_path).filter((p): p is string => !!p),
    ];
    if (paths.length > 0) {
      await db.storage.from("product-images").remove(paths);
    }

    const { error } = await db.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
  });

export const Route = createFileRoute("/admin/products/")({
  loader: () => fetchProducts(),
  head: () => ({ meta: [{ title: "Products — HerbHealth Admin" }] }),
  component: AdminProducts,
});

const stockColors: Record<string, string> = {
  in: "text-green-600",
  low: "text-yellow-600",
  out: "text-destructive",
};

function getImageUrl(path: string) {
  const url = import.meta.env["VITE_SUPABASE_URL"] as string;
  return `${url}/storage/v1/object/public/product-images/${path}`;
}

function AdminProducts() {
  const initial = Route.useLoaderData();
  const [products, setProducts] = useState(initial);
  const [search, setSearch] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.category?.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggle = async (id: string, current: boolean) => {
    await toggleActive({ data: { id, is_active: !current } });
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p)));
    toast(!current ? "Product visible on storefront" : "Product hidden from storefront");
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Permanently delete "${name}"? This removes the product and all its photos for good and cannot be undone. If you just want to hide it from the store instead, use the eye icon.`,
      )
    )
      return;
    try {
      await deleteProductPermanently({ data: { id } });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success(`"${name}" deleted permanently`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to delete product");
    }
  };

  const thumb = (p: DBProduct) => {
    const img = [...p.product_images].sort((a, b) => a.sort_order - b.sort_order)[0];
    return img ? getImageUrl(img.storage_path) : null;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Products</h1>
        <Button variant="hero" asChild>
          <Link to="/admin/products/new">
            <Plus className="size-4 mr-2" /> Add Product
          </Link>
        </Button>
      </div>

      <Input
        placeholder="Search by name, SKU or category…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 max-w-sm rounded-none"
      />

      <div className="border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => (
              <tr key={p.id} className={`bg-card ${!p.is_active ? "opacity-50" : ""}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {thumb(p) ? (
                      <img src={thumb(p)!} alt="" className="size-10 object-cover shrink-0" />
                    ) : (
                      <div className="size-10 bg-secondary shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.sku ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.category?.name ?? "—"}</td>
                <td className="px-4 py-3">{formatPrice(p.price)}</td>
                <td className={`px-4 py-3 capitalize ${stockColors[p.stock_status] ?? ""}`}>
                  {p.stock_status}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs uppercase tracking-wider ${p.is_active ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    {p.is_active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggle(p.id, p.is_active)}
                      title={p.is_active ? "Hide from storefront" : "Show on storefront"}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      {p.is_active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                    <Link
                      to="/admin/products/$id/edit"
                      params={{ id: p.id }}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      title="Edit"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      title="Delete permanently"
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}