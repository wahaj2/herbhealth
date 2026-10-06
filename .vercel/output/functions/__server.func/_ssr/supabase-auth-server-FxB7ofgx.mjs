import { c as setCookie$1, l as setResponseHeader, s as getCookies } from "./server-ByAcQfZh.mjs";
import { t as createServerClient } from "../_libs/@supabase/ssr+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-auth-server-FxB7ofgx.js
function createSupabaseAuthServerClient() {
	const supabaseUrl = process.env["SUPABASE_URL"];
	const supabaseAnonKey = process.env["SUPABASE_ANON_KEY"];
	if (!supabaseUrl || !supabaseAnonKey) throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables");
	return createServerClient(supabaseUrl, supabaseAnonKey, { cookies: {
		getAll() {
			const cookies = getCookies();
			return Object.entries(cookies).map(([name, value]) => ({
				name,
				value
			}));
		},
		setAll(cookiesToSet, headers) {
			for (const { name, value, options } of cookiesToSet) setCookie$1(name, value, options);
			for (const [key, value] of Object.entries(headers)) setResponseHeader(key, value);
		}
	} });
}
//#endregion
export { createSupabaseAuthServerClient };
