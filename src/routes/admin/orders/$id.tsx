import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/data/products";
import { toast } from "sonner";

type OrderItem = {
  id: string;
  product_name: string;
  variant: string | null;
  sku: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
};

type Order = {
  id: string;
  order_number: string;
  status: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  area: string | null;
  postal_code: string | null;
  notes: string | null;
  subtotal: number;
  shipping_fee: number;
  total: number;
  payment_method: string;
  created_at: string;
  order_items: OrderItem[];
};

const fetchOrder = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();
    const { data: order, error } = await db
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", data.id)
      .single();
    if (error || !order) throw notFound();
    return order as Order;
  });

const updateStatus = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), status: z.string() }))
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();
    const { error } = await db.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
  });

export const Route = createFileRoute("/admin/orders/$id")({
  loader: ({ params }) => fetchOrder({ data: { id: params.id } }),
  head: () => ({ meta: [{ title: "Order Detail — HerbHealth Admin" }] }),
  component: OrderDetail,
});

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatPlacedAt(iso: string) {
  return new Date(iso).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function OrderDetail() {
  const initial = Route.useLoaderData();
  const [order, setOrder] = useState(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("print") === "1") {
      const t = window.setTimeout(() => window.print(), 300);
      return () => window.clearTimeout(t);
    }
  }, []);

  const handleStatus = async (newStatus: string) => {
    setSaving(true);
    try {
      await updateStatus({ data: { id: order.id, status: newStatus } });
      setOrder((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
    setSaving(false);
  };

  return (
    <div className="p-8 max-w-3xl print:p-0 print:max-w-full">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div>
          <h1 className="font-display text-2xl">Order {order.order_number}</h1>
          <p className="text-xs text-muted-foreground mt-1">Placed {formatPlacedAt(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-block rounded px-3 py-1 text-sm capitalize ${STATUS_COLORS[order.status] ?? ""}`}
          >
            {order.status}
          </span>
          <Button variant="quiet" onClick={() => window.print()}>
            <Printer className="size-4 mr-2" /> Print / Save as PDF
          </Button>
        </div>
      </div>

      <div className="border border-border bg-card p-5 mb-6 print:hidden">
        <p className="text-sm font-medium mb-3">Update Status</p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={order.status === s ? "hero" : "quiet"}
              disabled={saving || order.status === s}
              onClick={() => handleStatus(s)}
              className="capitalize"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* ───────────────────── Receipt ───────────────────── */}
      <div className="border border-border bg-card p-8 print:border-0 print:p-0 print:shadow-none">
        <div className="flex items-start justify-between border-b border-dashed border-border pb-6">
          <div>
            <p className="font-display text-xl tracking-[0.14em] uppercase">
              Herb<span className="text-gold">Health</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Order Receipt</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-medium">{order.order_number}</p>
            <p className="mt-1 text-xs text-muted-foreground">Placed {formatPlacedAt(order.created_at)}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground print:hidden">
              Status: <span className="capitalize text-foreground">{order.status}</span>
            </p>
          </div>
        </div>

        <div className="py-6">
          <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Items</p>
          <div className="space-y-3">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p>{item.product_name}</p>
                  {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                  {item.sku && (
                    <p className="text-xs font-mono text-muted-foreground">SKU: {item.sku}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {formatPrice(item.unit_price)}
                  </p>
                </div>
                <p className="font-medium">{formatPrice(item.line_total)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-border mt-4 pt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span>{order.shipping_fee === 0 ? "Free" : formatPrice(order.shipping_fee)}</span>
            </div>
            <div className="flex justify-between font-display text-base pt-2 border-t border-border">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <p className="pt-1 text-xs uppercase tracking-wide text-muted-foreground">
              Payment: Cash on Delivery
            </p>
          </div>
        </div>

        <div className="border-t border-dashed border-border pt-6 text-sm">
          <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
            Customer &amp; Delivery
          </p>
          <div className="grid gap-1">
            <p>
              <span className="text-muted-foreground">Name:</span> {order.customer_name}
            </p>
            <p>
              <span className="text-muted-foreground">Phone:</span> {order.phone}
            </p>
            {order.email && (
              <p>
                <span className="text-muted-foreground">Email:</span> {order.email}
              </p>
            )}
            <p className="mt-2">{order.address_line1}</p>
            {order.address_line2 && <p>{order.address_line2}</p>}
            <p>
              {order.area ? `${order.area}, ` : ""}
              {order.city}
              {order.postal_code ? ` ${order.postal_code}` : ""}
            </p>
            {order.notes && <p className="mt-2 text-muted-foreground italic">Notes: {order.notes}</p>}
          </div>
        </div>

        <p className="mt-8 border-t border-dashed border-border pt-4 text-center text-xs text-muted-foreground">
          Thank you for shopping with HerbHealth. Please keep the exact amount ready for the rider.
        </p>
      </div>
    </div>
  );
}