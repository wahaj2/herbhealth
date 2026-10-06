import { i as createServerFn } from "./server-ByAcQfZh.mjs";
import { t as createServerRpc } from "./createServerRpc-DXxI8Usm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-C56QiKwU.js
var checkAdminSession_createServerFn_handler = createServerRpc({
	id: "15e979322b805e51ff201ebb738cff155eca4cf23b24de0f24d34dd6c3c0ff13",
	name: "checkAdminSession",
	filename: "src/routes/admin/route.tsx"
}, (opts) => checkAdminSession.__executeServer(opts));
var checkAdminSession = createServerFn({ method: "GET" }).handler(checkAdminSession_createServerFn_handler, async () => {
	const { createSupabaseAuthServerClient } = await import("./supabase-auth-server-FxB7ofgx.mjs");
	const { data: { user } } = await createSupabaseAuthServerClient().auth.getUser();
	return { authenticated: !!user };
});
//#endregion
export { checkAdminSession_createServerFn_handler };
