import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type Product } from "@/data/products";

export type CartLine = {
  slug: string;
  qty: number;
  variant?: string | undefined;
  snapshot: Product; // full product stored at add-to-cart time
};

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: Product, qty?: number, variant?: string) => void;
  removeFromCart: (slug: string, variant?: string) => void;
  setQty: (slug: string, qty: number, variant?: string) => void;
  toggleWishlist: (slug: string) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
  lines: { product: Product; qty: number; variant?: string | undefined }[];
};

const ShopContext = createContext<ShopState | null>(null);

const CART_KEY = "ha_cart";
const WISH_KEY = "ha_wishlist";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// A cart line is identified by slug + variant together, so two colors (or
// sizes) of the same product are always separate lines instead of one
// overwriting the other.
function sameLine(a: { slug: string; variant?: string | undefined }, slug: string, variant?: string) {
  return a.slug === slug && (a.variant ?? "") === (variant ?? "");
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setCart(read<CartLine[]>(CART_KEY, []));
    setWishlist(read<string[]>(WISH_KEY, []));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (typeof window !== "undefined")
      window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const value = useMemo<ShopState>(() => {
    const lines = cart.map((line) => ({
      product: line.snapshot,
      qty: line.qty,
      variant: line.variant,
    }));

    return {
      cart,
      wishlist,
      cartOpen,
      setCartOpen,
      lines,
      count: cart.reduce((sum, l) => sum + l.qty, 0),
      subtotal: lines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
      addToCart: (product, qty = 1, variant) =>
        setCart((prev) => {
          const existing = prev.find((l) => sameLine(l, product.slug, variant));
          if (existing)
            return prev.map((l) =>
              sameLine(l, product.slug, variant) ? { ...l, qty: l.qty + qty } : l,
            );
          return [...prev, { slug: product.slug, qty, variant, snapshot: product }];
        }),
      removeFromCart: (slug, variant) =>
        setCart((prev) => prev.filter((l) => !sameLine(l, slug, variant))),
      setQty: (slug, qty, variant) =>
        setCart((prev) =>
          qty <= 0
            ? prev.filter((l) => !sameLine(l, slug, variant))
            : prev.map((l) => (sameLine(l, slug, variant) ? { ...l, qty } : l)),
        ),
      toggleWishlist: (slug) =>
        setWishlist((prev) =>
          prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
        ),
      clearCart: () => setCart([]),
    };
  }, [cart, wishlist, cartOpen]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}