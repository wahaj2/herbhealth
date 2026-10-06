import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { QuickView } from "@/components/QuickView";
import { Newsletter } from "@/components/Newsletter";
import { type Product } from "@/data/products";
import { useShop } from "@/lib/shop-store";
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

const fetchShopData = createServerFn({ method: "GET" }).handler(async () => {
  const { createServerSupabase } = await import("@/lib/supabase-server");
  const db = createServerSupabase();

  const [{ data: products }, { data: cats }] = await Promise.all([
    db
      .from("products")
      .select(
        "id, slug, name, price, compare_at_price, material, color, sizes, stock_status, is_bestseller, short_description, description, care_instructions, category:categories(name), product_images(storage_path, sort_order)",
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
    db.from("categories").select("name").order("name"),
  ]);

  return {
    products: (products ?? []) as unknown as DBProduct[],
    categoryNames: (cats ?? []).map((c) => c.name) as string[],
  };
});

type Search = { category?: string; wishlist?: boolean };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    ...(typeof search["category"] === "string" ? { category: search["category"] } : {}),
    ...(search["wishlist"] ? { wishlist: true } : {}),
  }),
  loader: () => fetchShopData(),
  head: () => ({
    meta: [
      { title: "Shop All Wellness Products — HerbHealth" },
      {
        name: "description",
        content:
          "Browse the full HerbHealth collection: essential oils, herbal teas, supplements and tinctures. Filter by form, variant and price.",
      },
      { property: "og:title", content: "Shop All Wellness Products — HerbHealth" },
      {
        property: "og:description",
        content: "Filter by form, variant, price and category. Free delivery on orders over Rs 3,000.",
      },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

const sorts = { newest: "Newest", priceAsc: "Price: Low to High", popular: "Popularity" } as const;

function Shop() {
  const { products: dbProducts, categoryNames } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { wishlist } = useShop();

  const products = useMemo(() => dbProducts.map(dbToProduct), [dbProducts]);

  const [quick, setQuick] = useState<Product | null>(null);
  const [material, setMaterial] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState<keyof typeof sorts>("newest");

  const activeStyle = search.category;
  const onlyWishlist = !!search.wishlist;

  // Derive unique materials and colors from actual DB products
  const materials = useMemo(
    () => [...new Set(products.map((p) => p.material).filter(Boolean))],
    [products],
  );
  const colors = useMemo(
    () => [...new Set(products.map((p) => p.color).filter(Boolean))],
    [products],
  );

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const visible = useMemo(() => {
    let list = products.filter(
      (p) =>
        (!activeStyle || p.category === activeStyle) &&
        (material.length === 0 || material.includes(p.material)) &&
        (color.length === 0 || color.includes(p.color)) &&
        p.price <= maxPrice &&
        (!onlyWishlist || wishlist.includes(p.slug)),
    );
    if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "popular")
      list = [...list].sort((a, b) => Number(!!b.bestseller) - Number(!!a.bestseller));
    return list;
  }, [activeStyle, material, color, maxPrice, sort, onlyWishlist, wishlist, products]);

  return (
    <main className="pt-28">
      <header className="mx-auto max-w-6xl px-5 py-10 text-center">
        <p className="eyebrow">The Collection</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">
          {onlyWishlist ? "Your Wishlist" : (activeStyle ?? "All Products")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
          Small-batch herbal oils, teas and tonics made to be used, not saved for later.
        </p>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-20 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-8">
          <div>
            <p className="eyebrow">Category</p>
            <div className="mt-3 space-y-2">
              <button
                onClick={() => navigate({ search: {} })}
                className={cn(
                  "block text-sm text-muted-foreground hover:text-gold",
                  !activeStyle && !onlyWishlist && "text-gold",
                )}
              >
                All Products
              </button>
              {categoryNames.map((s) => (
                <button
                  key={s}
                  onClick={() => navigate({ search: { category: s } })}
                  className={cn(
                    "block text-sm text-muted-foreground hover:text-gold",
                    activeStyle === s && "text-gold",
                  )}
                >
                  {s}
                </button>
              ))}
              <button
                onClick={() => navigate({ search: { wishlist: true } })}
                className={cn(
                  "block text-sm text-muted-foreground hover:text-gold",
                  onlyWishlist && "text-gold",
                )}
              >
                Wishlist ({wishlist.length})
              </button>
            </div>
          </div>

          {materials.length > 0 && (
            <div>
              <p className="eyebrow">Form</p>
              <div className="mt-3 space-y-2">
                {materials.map((m) => (
                  <label key={m} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      className="accent-gold"
                      checked={material.includes(m)}
                      onChange={() => toggle(material, setMaterial, m)}
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div>
              <p className="eyebrow">Variant</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggle(color, setColor, c)}
                    className={cn(
                      "border border-border px-3 py-1 text-xs text-muted-foreground",
                      color.includes(c) && "border-gold text-gold",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="eyebrow">Max price: Rs {maxPrice.toLocaleString("en-PK")}</p>
            <input
              type="range"
              min={500}
              max={5000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-3 w-full accent-gold"
              aria-label="Maximum price"
            />
          </div>

          <Button
            variant="quiet"
            className="w-full"
            onClick={() => {
              setMaterial([]);
              setColor([]);
              setMaxPrice(5000);
              navigate({ search: {} });
            }}
          >
            Clear filters
          </Button>
        </aside>

        <section>
          <div className="flex items-center justify-between border-b border-border pb-4">
            <p className="text-xs text-muted-foreground">{visible.length} pieces</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as keyof typeof sorts)}
              className="h-9 border border-input bg-background px-2 text-xs"
              aria-label="Sort products"
            >
              {Object.entries(sorts).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {visible.length === 0 ? (
            <p className="py-20 text-center text-sm text-muted-foreground">
              {products.length === 0
                ? "No products have been added yet."
                : "Nothing matches those filters yet."}
            </p>
          ) : (
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((p) => (
                <ProductCard key={p.slug} product={p} onQuickView={setQuick} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Newsletter />
      <QuickView product={quick} onClose={() => setQuick(null)} />
    </main>
  );
}
