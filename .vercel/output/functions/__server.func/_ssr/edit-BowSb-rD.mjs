import { X as notFound } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as createServerFn } from "./server-ByAcQfZh.mjs";
import { t as createServerRpc } from "./createServerRpc-DXxI8Usm.mjs";
import { l as stringType, s as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/edit-BowSb-rD.js
var fetchProductForEdit_createServerFn_handler = createServerRpc({
	id: "5701ab49f9b1200e7e761fac6183a3f5f744acf46eb0117fc7ce8f39297f1d05",
	name: "fetchProductForEdit",
	filename: "src/routes/admin/products/$id/edit.tsx"
}, (opts) => fetchProductForEdit.__executeServer(opts));
var fetchProductForEdit = createServerFn({ method: "GET" }).validator(objectType({ id: stringType() })).handler(fetchProductForEdit_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const db = createServerSupabase();
	const [{ data: product, error }, { data: cats }] = await Promise.all([db.from("products").select("id, slug, name, sku, price, compare_at_price, category_id, material, color, sizes, stock_status, stock_quantity, is_bestseller, is_active, short_description, description, care_instructions, product_images(id, storage_path, sort_order), product_variants(id, color_name, color_hex, sku, image_path, stock_quantity, sort_order)").eq("id", data.id).single(), db.from("categories").select("id, name").order("name")]);
	if (error || !product) throw notFound();
	return {
		product,
		categories: cats ?? []
	};
});
//#endregion
export { fetchProductForEdit_createServerFn_handler };
