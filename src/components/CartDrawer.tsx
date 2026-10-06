import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatPrice } from "@/data/products";
import { useShop } from "@/lib/shop-store";
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from "@/lib/store-config";

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, setQty, removeFromCart, subtotal } = useShop();
  const navigate = useNavigate();

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">Your Cart</SheetTitle>
          <SheetDescription>
            {subtotal >= FREE_SHIPPING_THRESHOLD
              ? "You've unlocked free delivery!"
              : `Free delivery on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}.`}
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">Your cart is still empty.</p>
            <Button variant="hero" onClick={() => setCartOpen(false)} asChild>
              <Link to="/shop">Shop the collection</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto py-4">
              {lines.map(({ product, qty, variant }) => (
                <div key={`${product.slug}-${variant ?? "default"}`} className="flex gap-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="size-20 shrink-0 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-display text-sm">{product.name}</p>
                    {variant && <p className="text-xs text-muted-foreground">{variant}</p>}
                    <p className="mt-1 text-sm">{formatPrice(product.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        className="grid size-7 place-items-center border border-border"
                        onClick={() => setQty(product.slug, qty - 1, variant)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{qty}</span>
                      <button
                        className="grid size-7 place-items-center border border-border"
                        onClick={() => setQty(product.slug, qty + 1, variant)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3" />
                      </button>
                      <button
                        className="ml-auto text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(product.slug, variant)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-border pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span>{shippingFee === 0 ? "Free" : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex items-center justify-between font-display text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={() => {
                  setCartOpen(false);
                  navigate({ to: "/checkout" });
                }}
              >
                Proceed to Checkout
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                Cash on Delivery — pay when your order arrives.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
