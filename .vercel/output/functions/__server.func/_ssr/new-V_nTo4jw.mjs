import { i as createServerFn } from "./server-ByAcQfZh.mjs";
import { t as createServerRpc } from "./createServerRpc-DXxI8Usm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-V_nTo4jw.js
var fetchCategories_createServerFn_handler = createServerRpc({
	id: "0cac52cd340bd4bc3f511ad5af3942480712e99ef43bd0053522ce9c76ff7cc1",
	name: "fetchCategories",
	filename: "src/routes/admin/products/new.tsx"
}, (opts) => fetchCategories.__executeServer(opts));
var fetchCategories = createServerFn({ method: "GET" }).handler(fetchCategories_createServerFn_handler, async () => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const { data } = await createServerSupabase().from("categories").select("id, name").order("name");
	return data ?? [];
});
//#endregion
export { fetchCategories_createServerFn_handler };
