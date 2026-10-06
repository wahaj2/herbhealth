import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Package, ShoppingBag, AlertTriangle, TrendingUp } from "lucide-react";
import { formatPrice } from "@/data/products";

const fetchDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  const { createServerSupabase } = await import("@/lib/supabase-server");
  const db = createServerSupabase();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [
    { count: pendingCount },
    { data: weekOrders },
    { count: lowStockCount },
    { count: outStockCount },
  ] = await Promise.all([
    db.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    db
      .from("orders")
      .select("total, created_at")
      .gte("created_at", weekAgo.toISOString()),
    db
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("stock_status", "low")
      .eq("is_active", true),
    db
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("stock_status", "out")
      .eq("is_active", true),
  ]);

  const weekRevenue = (weekOrders ?? []).reduce((sum, o) => sum + Number(o.total), 0);
  const todayOrders = (weekOrders ?? []).filter(
    (o) => new Date(o.created_at) >= today,
  ).length;

  return {
    pendingCount: pendingCount ?? 0,
    weekOrderCount: weekOrders?.length ?? 0,
    weekRevenue,
    todayOrderCount: todayOrders,
    lowStockCount: (lowStockCount ?? 0) + (outStockCount ?? 0),
  };
});

export const Route = createFileRoute("/admin/")({
  loader: () => fetchDashboardStats(),
  head: () => ({ meta: [{ title: "Dashboard — HerbHealth Admin" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = Route.useLoaderData();

  const cards = [
    {
      label: "Pending Orders",
      value: stats.pendingCount,
      icon: ShoppingBag,
      href: "/admin/orders",
      urgent: stats.pendingCount > 0,
    },
    {
      label: "Orders This Week",
      value: stats.weekOrderCount,
      icon: TrendingUp,
      href: "/admin/orders",
      urgent: false,
    },
    {
      label: "Revenue This Week",
      value: formatPrice(stats.weekRevenue),
      icon: TrendingUp,
      href: "/admin/orders",
      urgent: false,
    },
    {
      label: "Low / Out of Stock",
      value: stats.lowStockCount,
      icon: AlertTriangle,
      href: "/admin/products",
      urgent: stats.lowStockCount > 0,
    },
  ];

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl mb-8">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.href}
            className="border border-border bg-card p-6 hover:border-gold transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{card.label}</p>
              <card.icon
                className={`size-4 ${card.urgent ? "text-destructive" : "text-muted-foreground"}`}
              />
            </div>
            <p className={`font-display text-2xl ${card.urgent ? "text-destructive" : ""}`}>
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/products/new"
          className="flex items-center gap-3 border border-border bg-card p-5 hover:border-gold transition-colors"
        >
          <Package className="size-5 text-gold" />
          <div>
            <p className="font-medium text-sm">Add New Product</p>
            <p className="text-xs text-muted-foreground">Upload photos and set pricing</p>
          </div>
        </Link>
        <Link
          to="/admin/orders"
          className="flex items-center gap-3 border border-border bg-card p-5 hover:border-gold transition-colors"
        >
          <ShoppingBag className="size-5 text-gold" />
          <div>
            <p className="font-medium text-sm">View All Orders</p>
            <p className="text-xs text-muted-foreground">Manage and update order status</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
