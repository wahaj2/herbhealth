import { X as notFound } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as createServerFn } from "./_ssr/server-ByAcQfZh.mjs";
import { t as createServerRpc } from "./_ssr/createServerRpc-DXxI8Usm.mjs";
import { l as stringType, s as objectType } from "./_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-BmucxVZS.js
var fetchOrder_createServerFn_handler = createServerRpc({
	id: "75ec024c368b1e938dcf8698759c0537df2840d531e4fd51529df76dd17306e7",
	name: "fetchOrder",
	filename: "src/routes/admin/orders/$id.tsx"
}, (opts) => fetchOrder.__executeServer(opts));
var fetchOrder = createServerFn({ method: "GET" }).validator(objectType({ id: stringType() })).handler(fetchOrder_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./_ssr/supabase-server-CNnhpOtG.mjs");
	const { data: order, error } = await createServerSupabase().from("orders").select("*, order_items(*)").eq("id", data.id).single();
	if (error || !order) throw notFound();
	return order;
});
var updateStatus_createServerFn_handler = createServerRpc({
	id: "6f5c66fa509d22e9041a240cd8896f0922ca1d6a7bba576494bf85a9e1279f91",
	name: "updateStatus",
	filename: "src/routes/admin/orders/$id.tsx"
}, (opts) => updateStatus.__executeServer(opts));
var updateStatus = createServerFn({ method: "POST" }).validator(objectType({
	id: stringType(),
	status: stringType()
})).handler(updateStatus_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./_ssr/supabase-server-CNnhpOtG.mjs");
	const { error } = await createServerSupabase().from("orders").update({ status: data.status }).eq("id", data.id);
	if (error) throw new Error(error.message);
});
//#endregion
export { fetchOrder_createServerFn_handler, updateStatus_createServerFn_handler };
