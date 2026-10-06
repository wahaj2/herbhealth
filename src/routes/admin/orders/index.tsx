import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ChevronLeft, ChevronRight, Download, Printer, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/data/products";
import { toast } from "sonner";

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  city: string;
  total: number;
  status: string;
  created_at: string;
  order_items: { sku: string | null; quantity: number }[];
};

const fetchOrders = createServerFn({ method: "GET" }).handler(async () => {
  const { createServerSupabase } = await import("@/lib/supabase-server");
  const db = createServerSupabase();
  const { data, error } = await db
    .from("orders")
    .select(
      "id, order_number, customer_name, phone, city, total, status, created_at, order_items(sku, quantity)",
    )
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Order[];
});

// Deletes an order permanently. order_items cascades automatically
// (ON DELETE CASCADE from the Phase 1 schema) — there are no storage files
// tied to an order, so nothing else needs cleanup.
const deleteOrder = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();
    const { error } = await db.from("orders").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
  });

export const Route = createFileRoute("/admin/orders/")({
  loader: () => fetchOrders(),
  head: () => ({ meta: [{ title: "Orders — HerbHealth Admin" }] }),
  component: AdminOrders,
});

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const ALL_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const PAGE_SIZE = 20;

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function skuSummary(items: { sku: string | null; quantity: number }[]) {
  return items
    .filter((i) => i.sku)
    .map((i) => `${i.sku} ×${i.quantity}`)
    .join(", ");
}

function AdminOrders() {
  const initial = Route.useLoaderData();
  const [orders, setOrders] = useState(initial);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.order_items.some((i) => i.sku?.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCsv = () => {
    const header = ["Order #", "Customer", "Phone", "City", "SKU(s)", "Total (PKR)", "Status", "Date & Time"];
    const rows = filtered.map((o) => [
      o.order_number,
      o.customer_name,
      o.phone,
      o.city,
      skuSummary(o.order_items),
      String(o.total),
      o.status,
      formatDateTime(o.created_at),
    ]);
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [header, ...rows].map((r) => r.map(escape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string, orderNumber: string) => {
    if (
      !confirm(
        `Permanently delete order ${orderNumber}? This cannot be undone. This does not restore any stock or notify the customer — it only removes the order record.`,
      )
    )
      return;
    try {
      await deleteOrder({ data: { id } });
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast.success(`Order ${orderNumber} deleted`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to delete order");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl">Orders</h1>
        <Button variant="quiet" onClick={exportCsv} disabled={filtered.length === 0}>
          <Download className="size-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Input
          placeholder="Search order #, name, phone, SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs rounded-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Order #</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">City</th>
              <th className="px-4 py-3 text-left">SKU(s)</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date &amp; Time</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paged.map((o) => (
              <tr key={o.id} className="bg-card hover:bg-secondary/20 transition-colors">
                <td className="px-4 py-3">
                  <Link
                    to="/admin/orders/$id"
                    params={{ id: o.id }}
                    className="font-medium text-gold hover:underline"
                  >
                    {o.order_number}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p>{o.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{o.phone}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{o.city}</td>
                <td className="px-4 py-3">
                  <p
                    className="max-w-[180px] truncate font-mono text-xs text-muted-foreground"
                    title={skuSummary(o.order_items)}
                  >
                    {skuSummary(o.order_items) || "—"}
                  </p>
                </td>
                <td className="px-4 py-3">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs capitalize ${STATUS_COLORS[o.status] ?? ""}`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                  {formatDateTime(o.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to="/admin/orders/$id"
                      params={{ id: o.id }}
                      search={{ print: "1" }}
                      className="inline-flex p-1 text-muted-foreground hover:text-gold"
                      title="Print receipt"
                    >
                      <Printer className="size-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(o.id, o.order_number)}
                      className="inline-flex p-1 text-muted-foreground hover:text-destructive"
                      title="Delete order"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length} order{filtered.length === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="quiet"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
              .reduce<(number | "gap")[]>((acc, n, i, arr) => {
                if (i > 0 && n - arr[i - 1]! > 1) acc.push("gap");
                acc.push(n);
                return acc;
              }, [])
              .map((n, i) =>
                n === "gap" ? (
                  <span key={`gap-${i}`} className="px-2 text-xs text-muted-foreground">
                    …
                  </span>
                ) : (
                  <Button key={n} size="sm" variant={n === page ? "hero" : "quiet"} onClick={() => setPage(n)}>
                    {n}
                  </Button>
                ),
              )}
            <Button
              size="sm"
              variant="quiet"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}