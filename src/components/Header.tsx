import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { count, wishlist, setCartOpen } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20">
        <button
          className="md:hidden -ml-2 p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <Menu className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link to="/" className="font-display text-lg tracking-[0.18em] uppercase sm:text-xl">
          Herb<span className="text-gold">Health</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-xs uppercase tracking-[0.2em] text-foreground/75 transition-colors hover:text-gold"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link to="/shop" search={{ wishlist: true }} className="relative p-2" aria-label="Wishlist">
            <Heart className="size-5" />
            {wishlist.length > 0 && (
              <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-gold text-[10px] text-gold-foreground">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button className="relative p-2" onClick={() => setCartOpen(true)} aria-label="Open cart">
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-gold text-[10px] text-gold-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-3 text-xs uppercase tracking-[0.2em] text-foreground/80"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export function AnnouncementBar() {
  return (
    <div className="bg-primary px-4 py-2 text-center text-[11px] uppercase tracking-[0.22em] text-primary-foreground">
      Free delivery on orders over Rs 3,000 · Cash on Delivery · Nationwide
    </div>
  );
}

export { X };
