import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatPrice, stockLabel, type Product } from "@/data/products";
import { useShop } from "@/lib/shop-store";

export function QuickView({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { addToCart, setCartOpen } = useShop();

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        {product && (
          <div className="grid gap-0 sm:grid-cols-2">
            <img
              src={product.images[0]}
              alt={product.name}
              width={1024}
              height={1024}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
            <div className="p-6">
              <p className="eyebrow">{product.category}</p>
              <DialogTitle className="mt-2 font-display text-2xl">{product.name}</DialogTitle>
              <p className="mt-2 text-lg">{formatPrice(product.price)}</p>
              <p className="mt-4 text-sm text-muted-foreground">{product.description}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-gold">
                {stockLabel[product.stock]}
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <Button
                  variant="hero"
                  size="xl"
                  disabled={product.stock === "out"}
                  onClick={() => {
                    addToCart(product);
                    onClose();
                    setCartOpen(true);
                  }}
                >
                  {product.stock === "out" ? "Sold Out" : "Add to Cart"}
                </Button>
                <Button variant="quiet" asChild onClick={onClose}>
                  <Link to="/product/$slug" params={{ slug: product.slug }}>
                    View full details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
