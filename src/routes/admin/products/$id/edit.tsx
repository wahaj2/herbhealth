import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ProductForm, type ExistingImage, type ExistingVariant, type ProductFormValues } from "@/components/ProductForm";

type ProductForEdit = {
  id: string;
  slug: string;
  name: string;
  sku: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  material: string | null;
  color: string | null;
  sizes: string[] | null;
  stock_status: "in" | "low" | "out";
  stock_quantity: number;
  is_bestseller: boolean;
  is_active: boolean;
  short_description: string | null;
  description: string | null;
  care_instructions: string | null;
  product_images: ExistingImage[];
  product_variants: ExistingVariant[];
};

const fetchProductForEdit = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<{ product: ProductForEdit; categories: { id: string; name: string }[] }> => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();
    const [{ data: product, error }, { data: cats }] = await Promise.all([
      db
        .from("products")
        .select(
          "id, slug, name, sku, price, compare_at_price, category_id, material, color, sizes, stock_status, stock_quantity, is_bestseller, is_active, short_description, description, care_instructions, product_images(id, storage_path, sort_order), product_variants(id, color_name, color_hex, sku, image_path, stock_quantity, sort_order)",
        )
        .eq("id", data.id)
        .single(),
      db.from("categories").select("id, name").order("name"),
    ]);
    if (error || !product) throw notFound();
    return {
      product: product as unknown as ProductForEdit,
      categories: (cats ?? []) as { id: string; name: string }[],
    };
  });

export const Route = createFileRoute("/admin/products/$id/edit")({
  loader: ({ params }) => fetchProductForEdit({ data: { id: params.id } }),
  head: () => ({ meta: [{ title: "Edit Product — HerbHealth Admin" }] }),
  component: EditProduct,
});

function EditProduct() {
  const { product, categories } = Route.useLoaderData();
  const { id } = Route.useParams();

  const defaults: Partial<ProductFormValues> = {
    name: product.name,
    slug: product.slug,
    sku: product.sku ?? undefined,
    price: product.price,
    compare_at_price: product.compare_at_price ?? undefined,
    category_id: product.category_id ?? undefined,
    material: product.material ?? undefined,
    color: product.color ?? undefined,
    sizes: product.sizes ? product.sizes.join(", ") : undefined,
    stock_status: product.stock_status,
    stock_quantity: product.stock_quantity,
    is_bestseller: product.is_bestseller,
    is_active: product.is_active,
    short_description: product.short_description ?? undefined,
    description: product.description ?? undefined,
    care_instructions: product.care_instructions ?? undefined,
  };

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl mb-8">Edit Product</h1>
      <ProductForm
        productId={id}
        defaultValues={defaults}
        existingImages={product.product_images}
        existingVariants={product.product_variants}
        categories={categories}
      />
    </div>
  );
}