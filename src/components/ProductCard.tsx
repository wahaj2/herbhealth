import { Link } from "@tanstack/react-router";
import { Eye, Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPrice, stockLabel, type Product } from "@/data/products";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: (p: Product) => void;
}) {
  const { addToCart, toggleWishlist, wishlist, setCartOpen } = useShop();
  const saved = wishlist.includes(product.slug);
  const soldOut = product.stock === "out";

  return (
    <article className="group">
      <div className="relative overflow-hidden bg-card">
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          <img
            src={product.images[0]}
            alt={`${product.name} — ${product.color} ${product.material} by HerbHealth`}
            width={1024}
            height={1024}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>

        <span
          className={cn(
            "absolute left-3 top-3 bg-background/90 px-2 py-1 text-[10px] uppercase tracking-[0.18em]",
            product.stock === "low" && "text-gold",
            soldOut && "text-muted-foreground",
          )}
        >
          {stockLabel[product.stock]}
        </span>

        <button
          onClick={() => {
            toggleWishlist(product.slug);
            toast(saved ? "Removed from wishlist" : "Saved to wishlist");
          }}
          aria-label="Save to wishlist"
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/90 transition-colors hover:text-gold"
        >
          <Heart className={cn("size-4", saved && "fill-gold text-gold")} />
        </button>

        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 bg-background/95 py-2 text-[11px] uppercase tracking-[0.2em] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Eye className="size-4" /> Quick View
          </button>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="font-display text-base hover:text-gold"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">{product.category}</p>
        </div>
        <div className="text-right">
          <p className="text-sm">{formatPrice(product.price)}</p>
          {product.compareAt && (
            <p className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAt)}
            </p>
          )}
        </div>
      </div>

      <Button
        variant="quiet"
        className="mt-3 w-full"
        disabled={soldOut}
        onClick={() => {
          addToCart(product);
          setCartOpen(true);
        }}
      >
        {soldOut ? "Sold Out" : "Add to Cart"}
      </Button>
    </article>
  );
}
