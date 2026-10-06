import { i as createServerFn } from "./server-Ca0AjyFE.mjs";
import { t as createServerRpc } from "./createServerRpc-DRx0ojag.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-DuH4_u_m.js
var fetchShopData_createServerFn_handler = createServerRpc({
	id: "7bad808d98f4f7ab0ca5e1a25feb4f379a64f6a4ff1c7fe9e3b77c62f2dfb29d",
	name: "fetchShopData",
	filename: "src/routes/shop.tsx"
}, (opts) => fetchShopData.__executeServer(opts));
var fetchShopData = createServerFn({ method: "GET" }).handler(fetchShopData_createServerFn_handler, async () => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const db = createServerSupabase();
	const [{ data: products }, { data: cats }] = await Promise.all([db.from("products").select("id, slug, name, price, compare_at_price, material, color, sizes, stock_status, is_bestseller, short_description, description, care_instructions, category:categories(name), product_images(storage_path, sort_order)").eq("is_active", true).order("created_at", { ascending: false }), db.from("categories").select("name").order("name")]);
	return {
		products: products ?? [],
		categoryNames: (cats ?? []).map((c) => c.name)
	};
});
//#endregion
export { fetchShopData_createServerFn_handler };
