import { i as createServerFn } from "./server-Ca0AjyFE.mjs";
import { t as createServerRpc } from "./createServerRpc-DRx0ojag.mjs";
import { l as stringType, n as booleanType, s as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-Bzz39Go3.js
var fetchProducts_createServerFn_handler = createServerRpc({
	id: "887d1bedc4c752a5fc0d72635ae03a11b4dfaecc30214062e2e393115b0a2b66",
	name: "fetchProducts",
	filename: "src/routes/admin/products/index.tsx"
}, (opts) => fetchProducts.__executeServer(opts));
var fetchProducts = createServerFn({ method: "GET" }).handler(fetchProducts_createServerFn_handler, async () => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const { data, error } = await createServerSupabase().from("products").select("id, slug, name, sku, price, stock_status, is_active, category:categories(name), product_images(storage_path, sort_order)").order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var toggleActive_createServerFn_handler = createServerRpc({
	id: "ed08c2fffb7d723765543899b2a04bfb6dbbe60be1835634cd5156bbf513cd64",
	name: "toggleActive",
	filename: "src/routes/admin/products/index.tsx"
}, (opts) => toggleActive.__executeServer(opts));
var toggleActive = createServerFn({ method: "POST" }).validator(objectType({
	id: stringType(),
	is_active: booleanType()
})).handler(toggleActive_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const { error } = await createServerSupabase().from("products").update({ is_active: data.is_active }).eq("id", data.id);
	if (error) throw new Error(error.message);
});
var deleteProductPermanently_createServerFn_handler = createServerRpc({
	id: "96283f8ad7d649c14371634b9d8e13cd34d81be200a166267f5ea3612f2715c6",
	name: "deleteProductPermanently",
	filename: "src/routes/admin/products/index.tsx"
}, (opts) => deleteProductPermanently.__executeServer(opts));
var deleteProductPermanently = createServerFn({ method: "POST" }).validator(objectType({ id: stringType() })).handler(deleteProductPermanently_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const db = createServerSupabase();
	const [{ data: images }, { data: variants }] = await Promise.all([db.from("product_images").select("storage_path").eq("product_id", data.id), db.from("product_variants").select("image_path").eq("product_id", data.id)]);
	const paths = [...(images ?? []).map((i) => i.storage_path), ...(variants ?? []).map((v) => v.image_path).filter((p) => !!p)];
	if (paths.length > 0) await db.storage.from("product-images").remove(paths);
	const { error } = await db.from("products").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
});
//#endregion
export { deleteProductPermanently_createServerFn_handler, fetchProducts_createServerFn_handler, toggleActive_createServerFn_handler };
