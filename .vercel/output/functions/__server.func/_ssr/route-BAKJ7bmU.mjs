import { i as createServerFn } from "./server-Ca0AjyFE.mjs";
import { t as createServerRpc } from "./createServerRpc-DRx0ojag.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-BAKJ7bmU.js
var checkAdminSession_createServerFn_handler = createServerRpc({
	id: "15e979322b805e51ff201ebb738cff155eca4cf23b24de0f24d34dd6c3c0ff13",
	name: "checkAdminSession",
	filename: "src/routes/admin/route.tsx"
}, (opts) => checkAdminSession.__executeServer(opts));
var checkAdminSession = createServerFn({ method: "GET" }).handler(checkAdminSession_createServerFn_handler, async () => {
	const { createSupabaseAuthServerClient } = await import("./supabase-auth-server-D-zpVp0-.mjs");
	const { data: { user } } = await createSupabaseAuthServerClient().auth.getUser();
	return { authenticated: !!user };
});
//#endregion
export { checkAdminSession_createServerFn_handler };
