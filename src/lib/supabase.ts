import { createBrowserClient } from "@supabase/ssr";

// Browser-safe client — uses public anon key only
// Free tier: 500MB DB, 1GB storage, 50k MAU — sufficient for a small boutique store
const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] as string;
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables");
}

// @supabase/ssr's browser client stores the session in cookies (not just
// localStorage), so the server can read it too. This is what fixes getting
// logged out of /admin on every page refresh — see the server-side half of
// this in src/lib/supabase-auth-server.ts.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);