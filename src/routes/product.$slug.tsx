import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { useState } from "react";
import { Heart, RotateCcw, ShieldCheck, Truck, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice, stockLabel, type Product } from "@/data/products";
import { useShop } from "@/lib/shop-store";
import { submitReview } from "@/lib/reviews";
import { cn } from "@/lib/utils";
import turmeric from "@/assets/turmeric-drops.svg";

function getImageUrl(path: string) {
  const url = import.meta.env["VITE_SUPABASE_URL"] as string;
  return `${url}/storage/v1/object/public/product-images/${path}`;
}

type DBProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  material: string | null;
  color: string | null;
  sizes: string[] | null;
  stock_status: string;
  is_bestseller: boolean;
  short_description: string | null;
  description: string | null;
  care_instructions: string | null;
  category: { name: string } | null;
  product_images: { storage_path: string; sort_order: number }[];
};

type VariantData = {
  id: string;
  color_name: string;
  color_hex: string | null;
  image_path: string | null;
  stock_quantity: number | null;
};

type ReviewRow = {
  id: string;
  customer_name: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
};

function dbToProduct(p: DBProduct): Product {
  const images =
    p.product_images.length > 0
      ? p.product_images
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((i) => getImageUrl(i.storage_path))
      : [turmeric];
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    compareAt: p.compare_at_price ?? undefined,
    category: p.category?.name ?? "",
    material: p.material ?? "",
    color: p.color ?? "",
    stock: p.stock_status as "in" | "low" | "out",
    bestseller: p.is_bestseller,
    images,
    short: p.short_description ?? "",
    description: p.description ?? "",
    care: p.care_instructions ?? "",
    sizes: p.sizes ?? undefined,
  };
}

const fetchProduct = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();

    const { data: product, error } = await db
      .from("products")
      .select(
        "id, slug, name, price, compare_at_price, material, color, sizes, stock_status, is_bestseller, short_description, description, care_instructions, category:categories(name), product_images(storage_path, sort_order)",
      )
      .eq("slug", data.slug)
      .eq("is_active", true)
      .single();

    if (error || !product) throw notFound();

    const [{ data: related }, { data: reviews }, { data: variants }] = await Promise.all([
      db
        .from("products")
        .select(
          "id, slug, name, price, compare_at_price, material, color, sizes, stock_status, is_bestseller, short_description, description, care_instructions, category:categories(name), product_images(storage_path, sort_order)",
        )
        .eq("is_active", true)
        .neq("slug", data.slug)
        .limit(3),
      db
        .from("reviews")
        .select("id, customer_name, rating, title, comment, created_at")
        .eq("product_id", product.id)
        .eq("is_approved", true)
        .order("created_at", { ascending: false }),
      db
        .from("product_variants")
        .select("id, color_name, color_hex, image_path, stock_quantity")
        .eq("product_id", product.id)
        .order("sort_order", { ascending: true }),
    ]);

    return {
      product: product as unknown as DBProduct,
      related: (related ?? []) as unknown as DBProduct[],
      reviews: (reviews ?? []) as ReviewRow[],
      variants: (variants ?? []) as VariantData[],
    };
  });

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => fetchProduct({ data: { slug: params.slug } }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Product not found — HerbHealth" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — HerbHealth` },
        {
          name: "description",
          content: `${p.short_description ?? ""} ${p.description ?? ""}`.slice(0, 155),
        },
        { property: "og:title", content: `${p.name} — HerbHealth` },
        { property: "og:description", content: p.short_description ?? p.name },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${p.slug}` },
      ],
      links: [{ rel: "canonical", href: `/product/${p.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            description: p.description,
            material: p.material,
            color: p.color,
            brand: { "@type": "Brand", name: "HerbHealth" },
            offers: {
              "@type": "Offer",
              price: p.price,
              priceCurrency: "PKR",
              availability:
                p.stock_status === "out"
                  ? "https://schema.org/OutOfStock"
                  : "https://schema.org/InStock",
            },
          }),
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product: dbProduct, related: dbRelated, reviews, variants } = Route.useLoaderData();
  const product = dbToProduct(dbProduct);
  const related = dbRelated.map(dbToProduct);

  const { addToCart, setCartOpen, toggleWishlist, wishlist } = useShop();
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [size, setSize] = useState(product.sizes?.[0]);

  // Default to the first in-stock color, if any variants exist.
  const firstAvailable = variants.find((v) => v.stock_quantity === null || v.stock_quantity > 0) ?? variants[0];
  const [selectedVariant, setSelectedVariant] = useState<VariantData | undefined>(firstAvailable);

  const saved = wishlist.includes(product.slug);
  const variantOutOfStock =
    !!selectedVariant && selectedVariant.stock_quantity !== null && selectedVariant.stock_quantity <= 0;
  const soldOut = product.stock === "out" || variantOutOfStock;

  // Gallery: a selected variant's own photo (if it has one) is shown first,
  // ahead of the product's regular photos.
  const gallery = selectedVariant?.image_path
    ? [getImageUrl(selectedVariant.image_path), ...product.images]
    : product.images;
  const activeImage = gallery[Math.min(active, gallery.length - 1)];

  const handleAdd = (goToCart: boolean) => {
    addToCart(product, 1, selectedVariant ? selectedVariant.color_name : size);
    setCartOpen(goToCart);
  };

  return (
    <main className="pt-28">
      <div className="mx-auto max-w-6xl px-5">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-gold">Home</Link>{" "}
          / <Link to="/shop" className="hover:text-gold">Shop</Link> /{" "}
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <div>
            <div
              className="overflow-hidden bg-card"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
            >
              <img
                src={activeImage}
                alt={`${product.name} — view ${active + 1}`}
                width={1024}
                height={1024}
                className={cn(
                  "aspect-square w-full object-cover transition-transform duration-700",
                  zoom && "scale-150",
                )}
              />
            </div>
            <div className="mt-4 flex gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    "size-20 overflow-hidden border",
                    i === active ? "border-gold" : "border-border",
                  )}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" width={1024} height={1024} loading="lazy" className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">{product.category}</p>
            <h1 className="mt-3 font-display text-4xl">{product.name}</h1>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl">{formatPrice(product.price)}</span>
              {product.compareAt && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.compareAt)}
                </span>
              )}
            </div>
            <p
              className={cn(
                "mt-3 text-xs uppercase tracking-[0.2em]",
                !soldOut && product.stock === "in" && "text-gold",
                !soldOut && product.stock === "low" && "text-destructive",
                soldOut && "text-muted-foreground",
              )}
            >
              {soldOut ? "Sold Out" : stockLabel[product.stock]}
            </p>

            <p className="mt-6 text-sm text-muted-foreground">{product.description}</p>

            {variants.length > 0 && (
              <div className="mt-8">
                <p className="eyebrow">
                  Variant{selectedVariant ? `: ${selectedVariant.color_name}` : ""}
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {variants.map((v) => {
                    const outOfStock = v.stock_quantity !== null && v.stock_quantity <= 0;
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        disabled={outOfStock}
                        onClick={() => {
                          setSelectedVariant(v);
                          setActive(0);
                        }}
                        title={outOfStock ? `${v.color_name} — out of stock` : v.color_name}
                        className={cn(
                          "relative size-9 rounded-full border-2 transition-all",
                          isSelected ? "border-gold" : "border-border",
                          outOfStock && "opacity-30 cursor-not-allowed",
                        )}
                        style={{ backgroundColor: v.color_hex ?? "#d4d4d4" }}
                      >
                        {outOfStock && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="h-px w-full rotate-45 bg-foreground/60" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {product.sizes && (
              <div className="mt-8">
                <p className="eyebrow">Size</p>
                <div className="mt-3 flex gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn(
                        "border px-4 py-2 text-xs uppercase tracking-[0.15em]",
                        size === s ? "border-gold text-gold" : "border-border text-muted-foreground",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3">
              <Button variant="hero" size="xl" disabled={soldOut} onClick={() => handleAdd(true)}>
                {soldOut ? "Sold Out" : "Add to Cart"}
              </Button>
              <Button variant="gold" size="xl" disabled={soldOut} onClick={() => handleAdd(true)}>
                Buy Now
              </Button>
              <Button
                variant="quiet"
                size="xl"
                onClick={() => {
                  toggleWishlist(product.slug);
                  toast(saved ? "Removed from wishlist" : "Saved to wishlist");
                }}
              >
                <Heart className={cn(saved && "fill-gold text-gold")} />
                {saved ? "Saved" : "Add to Wishlist"}
              </Button>
            </div>

            <div className="mt-8 grid gap-3 border-y border-border py-6 text-xs text-muted-foreground sm:grid-cols-3">
              <p className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-gold" /> Cash on Delivery
              </p>
              <p className="flex items-center gap-2">
                <Truck className="size-4 text-gold" /> Free over Rs 3,000
              </p>
              <p className="flex items-center gap-2">
                <RotateCcw className="size-4 text-gold" /> 7-day returns
              </p>
            </div>

            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="material">
                <AccordionTrigger>Ingredients &amp; details</AccordionTrigger>
                <AccordionContent>
                  {product.material} · {selectedVariant?.color_name ?? product.color}. Naturally
                  sourced, small-batch made and free from synthetic fillers. Batch-tested for
                  purity before it ships.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="care">
                <AccordionTrigger>Usage &amp; care instructions</AccordionTrigger>
                <AccordionContent>{product.care}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping &amp; returns</AccordionTrigger>
                <AccordionContent>
                  Free standard delivery on orders over Rs 3,000. Dispatched within 24 hours.
                  Delivery takes 2–5 business days across Pakistan. 7-day returns and exchanges.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {related.length > 0 && (
          <section className="py-20">
            <h2 className="font-display text-2xl">You may also like</h2>
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}

        <ProductReviews productId={dbProduct.id} reviews={reviews} />
      </div>
    </main>
  );
}

function ProductReviews({ productId, reviews }: { productId: string; reviews: ReviewRow[] }) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const avg = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitReview({
        data: { productId, customerName: name, customerEmail: email, rating, title, comment },
      });
      toast("Thank you for your review", { description: "It will appear here once our team reviews it." });
      setShowForm(false);
      setName("");
      setEmail("");
      setRating(5);
      setTitle("");
      setComment("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
    setSubmitting(false);
  };

  return (
    <section className="border-t border-border py-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Customer Reviews</h2>
          {reviews.length > 0 ? (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("size-4", i < Math.round(avg) ? "fill-gold text-gold" : "text-border")} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {avg.toFixed(1)} out of 5 ({reviews.length} review{reviews.length === 1 ? "" : "s"})
              </span>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">No reviews yet — be the first.</p>
          )}
        </div>
        <Button variant="quiet" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-8 max-w-lg space-y-4 border border-border bg-card p-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Your rating</p>
            <div className="mt-2 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button" onClick={() => setRating(i + 1)}>
                  <Star className={cn("size-6", i < rating ? "fill-gold text-gold" : "text-border")} />
                </button>
              ))}
            </div>
          </div>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email (optional, not published)"
            className="w-full border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Review title (optional)"
            className="w-full border border-border bg-background px-3 py-2 text-sm"
          />
          <textarea
            required
            minLength={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product…"
            rows={4}
            className="w-full border border-border bg-background px-3 py-2 text-sm"
          />
          <Button type="submit" variant="hero" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Review"}
          </Button>
        </form>
      )}

      <div className="mt-10 space-y-6">
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-border pb-6">
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("size-3.5", i < r.rating ? "fill-gold text-gold" : "text-border")} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{r.customer_name}</span>
              <span className="text-xs text-muted-foreground">
                · {new Date(r.created_at).toLocaleDateString()}
              </span>
            </div>
            {r.title && <p className="mt-2 text-sm font-medium">{r.title}</p>}
            {r.comment && <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}