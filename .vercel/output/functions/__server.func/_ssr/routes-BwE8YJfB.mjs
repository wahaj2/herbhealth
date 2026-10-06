import { i as createServerFn } from "./server-ByAcQfZh.mjs";
import { t as createServerRpc } from "./createServerRpc-DXxI8Usm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BwE8YJfB.js
var fetchHomeData_createServerFn_handler = createServerRpc({
	id: "26dbbcbe40063e8aedfd343cf1dfd4dfe5589f24591c0ba35e80c611d7c57c7c",
	name: "fetchHomeData",
	filename: "src/routes/index.tsx"
}, (opts) => fetchHomeData.__executeServer(opts));
var fetchHomeData = createServerFn({ method: "GET" }).handler(fetchHomeData_createServerFn_handler, async () => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const db = createServerSupabase();
	const [{ data: bestsellers }, { data: cats }, { data: content }, { data: reviews }] = await Promise.all([
		db.from("products").select("id, slug, name, price, compare_at_price, material, color, sizes, stock_status, is_bestseller, short_description, description, care_instructions, category:categories(name), product_images(storage_path, sort_order)").eq("is_active", true).eq("is_bestseller", true).order("created_at", { ascending: false }).limit(6),
		db.from("categories").select("id, name, slug, image_path").order("name"),
		db.from("site_content").select("key, value"),
		db.from("reviews").select("id, customer_name, rating, title, comment, product:products(name)").eq("is_approved", true).eq("rating", 5).order("created_at", { ascending: false }).limit(5)
	]);
	const contentMap = {};
	for (const row of content ?? []) contentMap[row.key] = row.value;
	return {
		bestsellers: bestsellers ?? [],
		categories: cats ?? [],
		content: contentMap,
		reviews: reviews ?? []
	};
});
//#endregion
export { fetchHomeData_createServerFn_handler };
