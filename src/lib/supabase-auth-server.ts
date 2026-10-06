import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie, setResponseHeader } from "@tanstack/react-start/server";

// A per-request Supabase client used ONLY to answer "is there a logged-in
// admin?" during server-side rendering (the /admin route guard). It reads
// the session from cookies that the browser client wrote on login.
//
// This is deliberately separate from src/lib/supabase-server.ts, which uses
// the service role key for actual data reads/writes inside server functions
// and has nothing to do with checking who's logged in.
export function createSupabaseAuthServerClient() {
  const supabaseUrl = process.env["SUPABASE_URL"] as string;
  const supabaseAnonKey = process.env["SUPABASE_ANON_KEY"] as string;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        const cookies = getCookies();
        return Object.entries(cookies).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value, options } of cookiesToSet) {
          setCookie(name, value, options);
        }
        for (const [key, value] of Object.entries(headers)) {
          setResponseHeader(key, value);
        }
      },
    },
  });
}