import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/data/products";
import { useShop } from "@/lib/shop-store";
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD, PAKISTAN_CITIES } from "@/lib/store-config";

// Pakistani mobile: 03XXXXXXXXX or +923XXXXXXXXX
const pkPhone = /^(\+92|0)3[0-9]{9}$/;

const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Name is required"),
  phone: z.string().regex(pkPhone, "Enter a valid Pakistani mobile number (03XXXXXXXXX)"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address_line1: z.string().min(5, "Address is required"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  area: z.string().optional(),
  postal_code: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

type OrderItem = {
  product_id: string | null;
  product_name: string;
  variant: string | undefined;
  unit_price: number;
  quantity: number;
  line_total: number;
};

// Server function — creates order + order_items using service role key.
// SKU is resolved here, server-side, from product_id + the chosen color —
// it is never sent from (or to) the browser, so it never appears anywhere
// on the storefront, only in the admin panel.
const placeOrder = createServerFn({ method: "POST" })
  .validator(
    z.object({
      form: checkoutSchema,
      items: z.array(
        z.object({
          product_id: z.string().nullable(),
          product_name: z.string(),
          variant: z.string().optional(),
          unit_price: z.number(),
          quantity: z.number(),
          line_total: z.number(),
        }),
      ),
      subtotal: z.number(),
      shipping_fee: z.number(),
      total: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();

    const productIds = [
      ...new Set(data.items.map((i) => i.product_id).filter((id): id is string => !!id)),
    ];

    const [{ data: products }, { data: variants }] = await Promise.all([
      productIds.length > 0
        ? db.from("products").select("id, sku").in("id", productIds)
        : Promise.resolve({ data: [] as { id: string; sku: string | null }[] }),
      productIds.length > 0
        ? db.from("product_variants").select("product_id, color_name, sku").in("product_id", productIds)
        : Promise.resolve({ data: [] as { product_id: string; color_name: string; sku: string | null }[] }),
    ]);

    const productSkuMap = new Map((products ?? []).map((p) => [p.id, p.sku]));
    const variantSkuMap = new Map(
      (variants ?? []).map((v) => [`${v.product_id}::${v.color_name}`, v.sku]),
    );

    const resolveSku = (productId: string | null, variant: string | undefined) => {
      if (!productId) return null;
      if (variant) {
        const vSku = variantSkuMap.get(`${productId}::${variant}`);
        if (vSku) return vSku;
      }
      return productSkuMap.get(productId) ?? null;
    };

    // Generate human-friendly order number
    const { count } = await db.from("orders").select("*", { count: "exact", head: true });
    const orderNumber = `HA-${10001 + (count ?? 0)}`;

    const { data: order, error: orderErr } = await db
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: data.form.customer_name,
        phone: data.form.phone,
        email: data.form.email || null,
        address_line1: data.form.address_line1,
        address_line2: data.form.address_line2 || null,
        city: data.form.city,
        area: data.form.area || null,
        postal_code: data.form.postal_code || null,
        notes: data.form.notes || null,
        subtotal: data.subtotal,
        shipping_fee: data.shipping_fee,
        total: data.total,
        payment_method: "cod",
      })
      .select("id, order_number")
      .single();

    if (orderErr || !order) throw new Error(orderErr?.message ?? "Failed to create order");

    const itemRows = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      variant: item.variant || null,
      sku: resolveSku(item.product_id, item.variant),
      unit_price: item.unit_price,
      quantity: item.quantity,
      line_total: item.line_total,
    }));

    const { error: itemsErr } = await db.from("order_items").insert(itemRows);
    if (itemsErr) throw new Error(itemsErr.message);

    return { orderNumber: order.order_number };
  });

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — HerbHealth" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { lines, subtotal, clearCart } = useShop();
  const navigate = useNavigate();

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({ resolver: zodResolver(checkoutSchema) });

  if (lines.length === 0) {
    return (
      <main className="pt-28">
        <div className="mx-auto max-w-xl px-5 py-20 text-center">
          <p className="font-display text-2xl">Your cart is empty</p>
          <Button variant="hero" className="mt-6" asChild>
            <a href="/shop">Shop the collection</a>
          </Button>
        </div>
      </main>
    );
  }

  const onSubmit = async (form: CheckoutForm) => {
    const items: OrderItem[] = lines.map(({ product, qty, variant }) => ({
      product_id: product.id ?? null,
      product_name: product.name,
      variant,
      unit_price: product.price,
      quantity: qty,
      line_total: product.price * qty,
    }));

    const { orderNumber } = await placeOrder({
      data: { form, items, subtotal, shipping_fee: shippingFee, total },
    });

    clearCart();
    navigate({ to: "/order-confirmation/$orderNumber", params: { orderNumber } });
  };

  return (
    <main className="pt-28">
      <div className="mx-auto max-w-6xl px-5 pb-20">
        <header className="py-10 text-center">
          <p className="eyebrow">Almost there</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Checkout</h1>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-12 lg:grid-cols-[1fr_380px]"
        >
          {/* Left: delivery details */}
          <div className="space-y-6">
            <h2 className="font-display text-xl">Delivery Details</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="customer_name">Full Name *</Label>
                <Input
                  id="customer_name"
                  className="mt-2 rounded-none"
                  placeholder="Your full name"
                  {...register("customer_name")}
                />
                {errors.customer_name && (
                  <p className="mt-1 text-xs text-destructive">{errors.customer_name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Mobile Number *</Label>
                <Input
                  id="phone"
                  className="mt-2 rounded-none"
                  placeholder="03XXXXXXXXX"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                className="mt-2 rounded-none"
                placeholder="you@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address_line1">Address *</Label>
              <Input
                id="address_line1"
                className="mt-2 rounded-none"
                placeholder="House/flat no., street name"
                {...register("address_line1")}
              />
              {errors.address_line1 && (
                <p className="mt-1 text-xs text-destructive">{errors.address_line1.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address_line2">Address Line 2 (optional)</Label>
              <Input
                id="address_line2"
                className="mt-2 rounded-none"
                placeholder="Apartment, block, landmark"
                {...register("address_line2")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="city">City *</Label>
                <Select onValueChange={(v) => setValue("city", v)}>
                  <SelectTrigger className="mt-2 rounded-none">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAKISTAN_CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && (
                  <p className="mt-1 text-xs text-destructive">{errors.city.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="area">Area / Neighbourhood (optional)</Label>
                <Input
                  id="area"
                  className="mt-2 rounded-none"
                  placeholder="e.g. DHA Phase 5"
                  {...register("area")}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="postal_code">Postal Code (optional)</Label>
              <Input
                id="postal_code"
                className="mt-2 rounded-none"
                placeholder="e.g. 75500"
                {...register("postal_code")}
              />
            </div>

            <div>
              <Label htmlFor="notes">Order Notes (optional)</Label>
              <Textarea
                id="notes"
                rows={3}
                className="mt-2 rounded-none"
                placeholder="Delivery instructions, gate code, etc."
                {...register("notes")}
              />
            </div>

            {/* COD notice */}
            <div className="border border-gold/40 bg-gold/5 p-4 text-sm">
              <p className="font-medium">Payment: Cash on Delivery</p>
              <p className="mt-1 text-muted-foreground">
                Please keep the exact amount ready for the rider. No card or online payment is
                required.
              </p>
            </div>
          </div>

          {/* Right: order summary */}
          <div className="space-y-6">
            <h2 className="font-display text-xl">Order Summary</h2>
            <div className="border border-border bg-card p-6 space-y-4">
              {lines.map(({ product, qty, variant }) => (
                <div key={`${product.slug}-${variant ?? "default"}`} className="flex gap-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="size-16 shrink-0 object-cover"
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-display">{product.name}</p>
                    {variant && <p className="text-xs text-muted-foreground">{variant}</p>}
                    <p className="text-muted-foreground">Qty: {qty}</p>
                  </div>
                  <p className="text-sm">{formatPrice(product.price * qty)}</p>
                </div>
              ))}

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>{shippingFee === 0 ? "Free" : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between font-display text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Placing Order…" : "Place Order (COD)"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}