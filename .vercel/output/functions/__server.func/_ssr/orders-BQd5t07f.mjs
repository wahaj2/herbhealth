import { i as createServerFn } from "./server-ByAcQfZh.mjs";
import { t as createServerRpc } from "./createServerRpc-DXxI8Usm.mjs";
import { l as stringType, s as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-BQd5t07f.js
var fetchOrders_createServerFn_handler = createServerRpc({
	id: "2a0552dd9d0bc11fd63967359811874a81f865df25944556928e32bf34cea1a2",
	name: "fetchOrders",
	filename: "src/routes/admin/orders/index.tsx"
}, (opts) => fetchOrders.__executeServer(opts));
var fetchOrders = createServerFn({ method: "GET" }).handler(fetchOrders_createServerFn_handler, async () => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const { data, error } = await createServerSupabase().from("orders").select("id, order_number, customer_name, phone, city, total, status, created_at, order_items(sku, quantity)").order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var deleteOrder_createServerFn_handler = createServerRpc({
	id: "8e06d7b65278d5c0dccf8f3c43241def91d08bb62f1158c34b420ad06d118868",
	name: "deleteOrder",
	filename: "src/routes/admin/orders/index.tsx"
}, (opts) => deleteOrder.__executeServer(opts));
var deleteOrder = createServerFn({ method: "POST" }).validator(objectType({ id: stringType() })).handler(deleteOrder_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const { error } = await createServerSupabase().from("orders").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
});
//#endregion
export { deleteOrder_createServerFn_handler, fetchOrders_createServerFn_handler };
