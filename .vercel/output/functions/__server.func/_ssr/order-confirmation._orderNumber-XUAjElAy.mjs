import { X as notFound } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as createServerFn } from "./server-Ca0AjyFE.mjs";
import { t as createServerRpc } from "./createServerRpc-DRx0ojag.mjs";
import { l as stringType, s as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order-confirmation._orderNumber-XUAjElAy.js
var fetchOrder_createServerFn_handler = createServerRpc({
	id: "688fd3234f171004f3e460daa4c77dec3fc43e71d131fd31552c2838be4469c8",
	name: "fetchOrder",
	filename: "src/routes/order-confirmation.$orderNumber.tsx"
}, (opts) => fetchOrder.__executeServer(opts));
var fetchOrder = createServerFn({ method: "GET" }).validator(objectType({ orderNumber: stringType() })).handler(fetchOrder_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const { data: order, error } = await createServerSupabase().from("orders").select("*, order_items(*)").eq("order_number", data.orderNumber).single();
	if (error || !order) throw notFound();
	return order;
});
//#endregion
export { fetchOrder_createServerFn_handler };
