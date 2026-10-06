import { r as createClient } from "../_libs/@supabase/ssr+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-server-CNnhpOtG.js
function createServerSupabase() {
	const url = process.env["SUPABASE_URL"];
	const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
	if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
	return createClient(url, key, { auth: { persistSession: false } });
}
//#endregion
export { createServerSupabase };
