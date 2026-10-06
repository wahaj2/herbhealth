import { createFileRoute, Outlet, Link, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { LayoutDashboard, Package, ShoppingBag, Tag, Star, Megaphone, Mail, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Runs entirely server-side (both on the initial SSR load and, via RPC, on
// client-side navigations between admin pages) — reads the session from
// cookies, which is what makes this survive a full page refresh. See
// src/lib/supabase-auth-server.ts for the cookie-reading client itself.
const checkAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const { createSupabaseAuthServerClient } = await import("@/lib/supabase-auth-server");
  const db = createSupabaseAuthServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  return { authenticated: !!user };
});

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    const { authenticated } = await checkAdminSession();
    if (!authenticated) throw redirect({ to: "/admin/login" });
  },
  component: AdminLayout,
});

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package, exact: false },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, exact: false },
  { to: "/admin/categories", label: "Categories", icon: Tag, exact: false },
  { to: "/admin/reviews", label: "Reviews", icon: Star, exact: false },
  { to: "/admin/content", label: "Content & Offers", icon: Megaphone, exact: false },
  { to: "/admin/subscribers", label: "Subscribers", icon: Mail, exact: false },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/admin/login";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  if (isLogin) return <Outlet />;

  return (
    <div className="flex min-h-screen bg-background print:block">
      {/* Sidebar — hidden entirely when printing */}
      <aside className="w-56 shrink-0 border-r border-border bg-card flex flex-col print:hidden">
        <div className="p-5 border-b border-border">
          <Link to="/" className="font-display text-sm tracking-[0.18em] uppercase">
            Herb<span className="text-gold">Health</span>
          </Link>
          <p className="mt-1 text-[10px] text-muted-foreground uppercase tracking-widest">Admin</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground rounded hover:text-foreground hover:bg-secondary/50 transition-colors"
              activeProps={{ className: "text-foreground bg-secondary/70" }}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm text-muted-foreground rounded hover:text-destructive hover:bg-secondary/50 transition-colors"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto print:overflow-visible print:w-full">
        <Outlet />
      </main>
    </div>
  );
}