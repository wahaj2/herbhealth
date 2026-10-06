import { i as createServerFn } from "./server-ByAcQfZh.mjs";
import { t as createServerRpc } from "./createServerRpc-DXxI8Usm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/subscribers-CK0Xg9k8.js
var fetchSubscribers_createServerFn_handler = createServerRpc({
	id: "ec402553749e21b05a00e980dee1da30ab3915860f5719e67540942f7e7571d3",
	name: "fetchSubscribers",
	filename: "src/routes/admin/subscribers/index.tsx"
}, (opts) => fetchSubscribers.__executeServer(opts));
var fetchSubscribers = createServerFn({ method: "GET" }).handler(fetchSubscribers_createServerFn_handler, async () => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const { data } = await createServerSupabase().from("subscribers").select("id, email, source, created_at").order("created_at", { ascending: false });
	return data ?? [];
});
//#endregion
export { fetchSubscribers_createServerFn_handler };
