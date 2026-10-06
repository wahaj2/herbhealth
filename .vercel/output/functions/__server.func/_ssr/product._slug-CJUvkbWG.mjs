import { X as notFound } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as createServerFn } from "./server-ByAcQfZh.mjs";
import { t as createServerRpc } from "./createServerRpc-DXxI8Usm.mjs";
import { l as stringType, s as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._slug-CJUvkbWG.js
var fetchProduct_createServerFn_handler = createServerRpc({
	id: "7827dd85f105cbd55e7dee491cd245a2ac9b8460b87c2c99e9ccef31eabb59ef",
	name: "fetchProduct",
	filename: "src/routes/product.$slug.tsx"
}, (opts) => fetchProduct.__executeServer(opts));
var fetchProduct = createServerFn({ method: "GET" }).validator(objectType({ slug: stringType() })).handler(fetchProduct_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const db = createServerSupabase();
	const { data: product, error } = await db.from("products").select("id, slug, name, price, compare_at_price, material, color, sizes, stock_status, is_bestseller, short_description, description, care_instructions, category:categories(name), product_images(storage_path, sort_order)").eq("slug", data.slug).eq("is_active", true).single();
	if (error || !product) throw notFound();
	const [{ data: related }, { data: reviews }, { data: variants }] = await Promise.all([
		db.from("products").select("id, slug, name, price, compare_at_price, material, color, sizes, stock_status, is_bestseller, short_description, description, care_instructions, category:categories(name), product_images(storage_path, sort_order)").eq("is_active", true).neq("slug", data.slug).limit(3),
		db.from("reviews").select("id, customer_name, rating, title, comment, created_at").eq("product_id", product.id).eq("is_approved", true).order("created_at", { ascending: false }),
		db.from("product_variants").select("id, color_name, color_hex, image_path, stock_quantity").eq("product_id", product.id).order("sort_order", { ascending: true })
	]);
	return {
		product,
		related: related ?? [],
		reviews: reviews ?? [],
		variants: variants ?? []
	};
});
//#endregion
export { fetchProduct_createServerFn_handler };
