import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { QuickView } from "@/components/QuickView";
import { TrustBadges } from "@/components/TrustBadges";
import { Newsletter } from "@/components/Newsletter";
import { type Product } from "@/data/products";
import hero from "@/assets/hero.svg";
import turmeric from "@/assets/turmeric-drops.svg"; // fallback shown until a category has an uploaded image

const CATEGORY_BLURBS: Record<string, string> = {
  "Essential Oils": "Breathe, unwind, restore",
  "Herbal Teas": "A quieter cup",
  Supplements: "Daily roots, steady you",
  "Tinctures & Tonics": "Drop by drop wellness",
};

function getImageUrl(path: string) {
  const url = import.meta.env["VITE_SUPABASE_URL"] as string;
  return `${url}/storage/v1/object/public/product-images/${path}`;
}

function dbProductToProduct(p: DBProduct): Product {
  const images =
    p.product_images.length > 0
      ? p.product_images
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((i) => getImageUrl(i.storage_path))
      : [turmeric]; // fallback placeholder
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

type FeaturedReview = {
  id: string;
  customer_name: string;
  rating: number;
  title: string | null;
  comment: string | null;
  product: { name: string } | null;
};

const fetchHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const { createServerSupabase } = await import("@/lib/supabase-server");
  const db = createServerSupabase();

  const [{ data: bestsellers }, { data: cats }, { data: content }, { data: reviews }] =
    await Promise.all([
      db
        .from("products")
        .select(
          "id, slug, name, price, compare_at_price, material, color, sizes, stock_status, is_bestseller, short_description, description, care_instructions, category:categories(name), product_images(storage_path, sort_order)",
        )
        .eq("is_active", true)
        .eq("is_bestseller", true)
        .order("created_at", { ascending: false })
        .limit(6),
      db.from("categories").select("id, name, slug, image_path").order("name"),
      db.from("site_content").select("key, value"),
      db
        .from("reviews")
        .select("id, customer_name, rating, title, comment, product:products(name)")
        .eq("is_approved", true)
        .eq("rating", 5)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const contentMap: Record<string, string> = {};
  for (const row of content ?? []) contentMap[row.key] = row.value;

  return {
    bestsellers: (bestsellers ?? []) as unknown as DBProduct[],
    categories: (cats ?? []) as {
      id: string;
      name: string;
      slug: string;
      image_path: string | null;
    }[],
    content: contentMap,
    reviews: (reviews ?? []) as unknown as FeaturedReview[],
  };
});

export const Route = createFileRoute("/")({
  loader: () => fetchHomeData(),
  head: () => ({
    meta: [
      { title: "HerbHealth — Natural Wellness & Balanced Living" },
      {
        name: "description",
        content:
          "Herbal oils, teas, supplements and tonics for everyday wellness. Naturally sourced, small-batch made. Free delivery on orders over Rs 3,000.",
      },
      { property: "og:title", content: "HerbHealth — Natural Wellness & Balanced Living" },
      {
        property: "og:description",
        content: "Small-batch herbal wellness, made honestly. Rooted in nature, made for you.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const { bestsellers: dbBestsellers, categories, content, reviews } = Route.useLoaderData();
  const [quick, setQuick] = useState<Product | null>(null);
  const bestsellers = dbBestsellers.map(dbProductToProduct);

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[88vh] w-full">
        <img
          src={content["hero_image_path"] ? getImageUrl(content["hero_image_path"]) : hero}
          alt="Herbal oils, dried botanicals and a wellness tonic arranged on a linen surface"
          width={1600}
          height={1200}
          className="absolute inset-0 size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/50 to-transparent" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl items-center px-5 pt-24">
          <div className="max-w-xl">
            <p className="eyebrow">{content["hero_eyebrow"] || "New Blends · 2026"}</p>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              {content["hero_title"] || "Natural Wellness & Balanced Living"}
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground">
              {content["hero_subtitle"] ||
                "Small-batch herbal oils, teas and tonics made from real ingredients — for mornings, evenings and everything between."}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button variant="hero" size="xl" asChild>
                <Link to="/shop">Shop New Blends</Link>
              </Button>
              <Button variant="quiet" size="xl" asChild>
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {content["promo_banner_enabled"] === "true" && content["promo_banner_text"] && (
        <div className="bg-gold px-5 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-primary">
          {content["promo_banner_text"]}
        </div>
      )}

      <TrustBadges />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="text-center">
            <p className="eyebrow">Shop by ritual</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">Find your daily blend</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.name}
                to="/shop"
                search={{ category: c.name }}
                className="group block overflow-hidden bg-card"
              >
                <img
                  src={c.image_path ? getImageUrl(c.image_path) : turmeric}
                  alt={`${c.name} collection`}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="p-4 text-center">
                  <p className="font-display text-lg">{c.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {CATEGORY_BLURBS[c.name] ?? "Shop the collection"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="bg-secondary/25 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Loved by many</p>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl">Bestsellers</h2>
              </div>
              <Link
                to="/shop"
                className="text-xs uppercase tracking-[0.2em] text-gold hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {bestsellers.map((p) => (
                <ProductCard key={p.slug} product={p} onQuickView={setQuick} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Rituals */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 lg:grid-cols-2">
        <img
          src={hero}
          alt="Herbal tea, oils and a wellness journal styled for a morning ritual"
          width={1600}
          height={1200}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
        <div>
          <p className="eyebrow">The Ritual Guide</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Three ways to slow down</h2>
          <ul className="mt-6 space-y-5 text-sm text-muted-foreground">
            <li>
              <span className="font-display text-base text-foreground">The Morning.</span>{" "}
              Turmeric elixir drops in warm water, five quiet minutes before the day starts.
            </li>
            <li>
              <span className="font-display text-base text-foreground">The Reset.</span>{" "}
              Ashwagandha capsules with lunch, eucalyptus oil in the diffuser through the afternoon.
            </li>
            <li>
              <span className="font-display text-base text-foreground">The Evening.</span>{" "}
              Chamomile tea, lavender oil on the pillow. The close every day deserves.
            </li>
          </ul>
          <Button variant="quiet" size="xl" className="mt-8" asChild>
            <Link to="/shop">Shop the rituals</Link>
          </Button>
        </div>
      </section>

      {/* Reviews — real 5-star, approved reviews from the database */}
      {reviews.length > 0 && (
        <section className="border-y border-border bg-card py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center">
              <p className="eyebrow">Kind words</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">From our community</h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {reviews.map((r) => (
                <figure key={r.id} className="border border-border bg-background p-6">
                  <p className="text-gold">{"★".repeat(r.rating)}</p>
                  <blockquote className="mt-3 text-sm text-muted-foreground">
                    "{r.title || r.comment}"
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-secondary font-display text-sm">
                      {r.customer_name.charAt(0)}
                    </span>
                    <span className="text-xs">
                      <span className="block font-medium">{r.customer_name}</span>
                      {r.product?.name && (
                        <span className="text-muted-foreground">on {r.product.name}</span>
                      )}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <Newsletter />
      <QuickView product={quick} onClose={() => setQuick(null)} />
    </main>
  );
}