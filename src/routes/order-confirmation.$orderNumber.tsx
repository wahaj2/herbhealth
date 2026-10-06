import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { formatPrice } from "@/data/products";
import { Button } from "@/components/ui/button";

const fetchOrder = createServerFn({ method: "GET" })
  .validator(z.object({ orderNumber: z.string() }))
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();

    const { data: order, error } = await db
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", data.orderNumber)
      .single();

    if (error || !order) throw notFound();
    return order as Order;
  });

type OrderItem = {
  id: string;
  product_name: string;
  variant: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  area: string | null;
  postal_code: string | null;
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
};

export const Route = createFileRoute("/order-confirmation/$orderNumber")({
  loader: async ({ params }) => fetchOrder({ data: { orderNumber: params.orderNumber } }),
  head: () => ({
    meta: [
      { title: "Order Confirmed — HerbHealth" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmation,
});

function OrderConfirmation() {
  const order = Route.useLoaderData();

  return (
    <main className="pt-28">
      <div className="mx-auto max-w-2xl px-5 pb-20">
        <div className="py-10 text-center">
          <p className="text-4xl">🎉</p>
          <h1 className="mt-4 font-display text-4xl">Order Confirmed!</h1>
          <p className="mt-3 text-muted-foreground">
            Thank you, {order.customer_name}. Your order has been placed successfully.
          </p>
          <p className="mt-2 text-sm font-medium">Order #{order.order_number}</p>
        </div>

        {/* COD reminder */}
        <div className="border border-gold/40 bg-gold/5 p-4 text-sm mb-8">
          <p className="font-medium">Payment: Cash on Delivery</p>
          <p className="mt-1 text-muted-foreground">
            Please keep <strong>{formatPrice(order.total)}</strong> in cash ready for the rider.
            No advance payment is required.
          </p>
        </div>

        {/* Items */}
        <div className="border border-border bg-card p-6 space-y-4 mb-6">
          <h2 className="font-display text-lg">Items Ordered</h2>
          {order.order_items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p>{item.product_name}</p>
                {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p>{formatPrice(item.line_total)}</p>
            </div>
          ))}
          <div className="border-t border-border pt-4 space-y-1 text-sm">
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
          </div>
        </div>

        {/* Delivery address */}
        <div className="border border-border bg-card p-6 mb-8 text-sm">
          <h2 className="font-display text-lg mb-3">Delivery Address</h2>
          <p>{order.customer_name}</p>
          <p>{order.phone}</p>
          <p>{order.address_line1}</p>
          {order.address_line2 && <p>{order.address_line2}</p>}
          <p>
            {order.area ? `${order.area}, ` : ""}
            {order.city}
            {order.postal_code ? ` ${order.postal_code}` : ""}
          </p>
        </div>

        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Questions? Email us at{" "}
            <a href="mailto:support@herbhealth.store" className="text-gold hover:underline">
              support@herbhealth.store
            </a>
          </p>
          <Button variant="hero" asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
