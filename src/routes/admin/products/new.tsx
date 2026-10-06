import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ProductForm } from "@/components/ProductForm";

const fetchCategories = createServerFn({ method: "GET" }).handler(async () => {
  const { createServerSupabase } = await import("@/lib/supabase-server");
  const db = createServerSupabase();
  const { data } = await db.from("categories").select("id, name").order("name");
  return (data ?? []) as { id: string; name: string }[];
});

export const Route = createFileRoute("/admin/products/new")({
  loader: () => fetchCategories(),
  head: () => ({ meta: [{ title: "New Product — HerbHealth Admin" }] }),
  component: NewProduct,
});

function NewProduct() {
  const categories = Route.useLoaderData();
  return (
    <div className="p-8">
      <h1 className="font-display text-2xl mb-8">New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
