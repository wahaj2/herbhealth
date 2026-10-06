import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg tracking-[0.18em] uppercase">
            Herb<span className="text-gold">Health</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Natural wellness, gently sourced. Herbal oils, teas and tonics for a more balanced
            everyday.
          </p>
        </div>

        <div>
          <p className="eyebrow">Shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            {["Essential Oils", "Herbal Teas", "Supplements", "Tinctures & Tonics"].map((c) => (
              <li key={c}>
                <Link
                  to="/shop"
                  search={{ category: c }}
                  className="text-muted-foreground transition-colors hover:text-gold"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Company</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/about" className="text-muted-foreground hover:text-gold">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-muted-foreground hover:text-gold">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/contact" hash="faq" className="text-muted-foreground hover:text-gold">
                Shipping &amp; Returns
              </Link>
            </li>
            <li>
              <Link to="/contact" hash="faq" className="text-muted-foreground hover:text-gold">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contact</p>
          <a
            href="mailto:hello@herbhealth.store"
            className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-gold"
          >
            <Mail className="size-4" /> hello@herbhealth.store
          </a>
          <div className="mt-4 flex gap-3">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-gold"
            >
              <Instagram className="size-5" />
            </a>
            <a href="https://pinterest.com" aria-label="Pinterest" className="hover:text-gold">
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.1-2 .1-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.5 1.9 1.8 0 3.2-1.9 3.2-4.7 0-2.4-1.8-4.1-4.3-4.1-2.9 0-4.6 2.2-4.6 4.4 0 .9.3 1.8.8 2.3.1.1.1.2.1.3l-.3 1c0 .2-.2.2-.3.1-1.2-.6-2-2.4-2-3.8 0-3.1 2.3-6 6.5-6 3.4 0 6.1 2.4 6.1 5.7 0 3.4-2.1 6.2-5.1 6.2-1 0-1.9-.5-2.2-1.1l-.6 2.3c-.2.9-.8 2-1.2 2.6A10 10 0 1 0 12 2z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-gold"
            >
              <Facebook className="size-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-5 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HerbHealth · herbhealth.store · Rooted in nature, made for
        everyday.
      </div>
    </footer>
  );
}
