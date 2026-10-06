import turmeric from "@/assets/turmeric-drops.svg";
import lavender from "@/assets/lavender-oil.svg";
import ashwagandha from "@/assets/ashwagandha-capsules.svg";
import chamomile from "@/assets/chamomile-tea.svg";
import eucalyptus from "@/assets/eucalyptus-oil.svg";
import neemBalm from "@/assets/neem-balm.svg";

export type Stock = "in" | "low" | "out";

export type Product = {
  id?: string | undefined; // present for DB-backed products; absent on the static fallback list below
  slug: string;
  name: string;
  price: number;
  compareAt?: number | undefined;
  category: string;
  material: string; // repurposed as "Form" (e.g. Essential Oil, Capsules, Loose Leaf Tea)
  color: string; // repurposed as "Variant" (e.g. Lavender, Turmeric & Black Pepper)
  stock: Stock;
  bestseller?: boolean | undefined;
  images: string[];
  short: string;
  description: string;
  care: string; // repurposed as usage instructions
  sizes?: string[] | undefined;
};

// Static fallback products (PKR pricing) — used until Supabase is connected
export const products: Product[] = [
  {
    slug: "golden-turmeric-elixir-drops",
    name: "Golden Turmeric Elixir Drops",
    price: 2900,
    compareAt: 3400,
    category: "Tinctures & Tonics",
    material: "Liquid Tincture",
    color: "Turmeric & Black Pepper",
    stock: "in",
    bestseller: true,
    images: [turmeric, ashwagandha, neemBalm],
    short: "A daily dropper of warmth, straight from the root.",
    description:
      "Cold-extracted turmeric root blended with black pepper for absorption and a whisper of raw honey. Three drops under the tongue or stirred into warm water brings a gentle, grounding lift to your morning ritual.",
    care:
      "Take 2–3 drops daily, morning or evening, diluted in water or tea. Store in a cool, dark place away from direct sunlight. Shake well before use.",
    sizes: ["30ml", "60ml"],
  },
  {
    slug: "lavender-calm-essential-oil",
    name: "Lavender Calm Essential Oil",
    price: 1800,
    category: "Essential Oils",
    material: "Essential Oil",
    color: "Lavender",
    stock: "low",
    bestseller: true,
    images: [lavender, eucalyptus, chamomile],
    short: "Slow your evening down, one deep breath at a time.",
    description:
      "Steam-distilled from high-altitude lavender flowers, this oil is calm in a bottle. A few drops in a diffuser, on a pillow, or blended into a carrier oil for the temples turns any room into a wind-down ritual.",
    care:
      "For diffusing: 4–5 drops in water. For topical use, dilute with a carrier oil. Keep out of direct sunlight and away from children.",
  },
  {
    slug: "ashwagandha-root-capsules",
    name: "Ashwagandha Root Capsules",
    price: 2400,
    category: "Supplements",
    material: "Capsules",
    color: "Ashwagandha 500mg",
    stock: "in",
    bestseller: true,
    images: [ashwagandha, turmeric, neemBalm],
    short: "Steadier days start with a steadier root.",
    description:
      "Organically grown ashwagandha root, milled and encapsulated at 500mg per serving. A traditional adaptogen taken daily to support a calmer response to everyday stress and steadier energy through the day.",
    care:
      "Take 1 capsule twice daily with meals, or as advised by your healthcare provider. Not recommended during pregnancy without medical guidance.",
  },
  {
    slug: "chamomile-wellness-tea",
    name: "Chamomile Wellness Tea",
    price: 1200,
    category: "Herbal Teas",
    material: "Loose Leaf Tea",
    color: "Chamomile & Honey",
    stock: "in",
    bestseller: true,
    images: [chamomile, lavender, eucalyptus],
    short: "The last cup before the lights go out.",
    description:
      "Whole chamomile flowers hand-blended with lemon balm and a touch of dried honey granules. Steeped for five minutes, it's the quiet close to a loud day — caffeine-free and gentle on the stomach.",
    care:
      "Steep 1 tsp in hot water (not boiling) for 4–5 minutes. Best enjoyed 30 minutes before bed. Store in an airtight container away from light.",
    sizes: ["50g Pouch", "100g Pouch"],
  },
  {
    slug: "eucalyptus-breathe-easy-oil",
    name: "Eucalyptus Breathe Easy Oil",
    price: 1900,
    category: "Essential Oils",
    material: "Essential Oil",
    color: "Eucalyptus & Mint",
    stock: "in",
    bestseller: true,
    images: [eucalyptus, lavender, chamomile],
    short: "One breath in, and the room feels bigger.",
    description:
      "A bracing blend of eucalyptus and peppermint, distilled to clear the head and open the chest. Reach for it during flu season, before a workout, or whenever a room needs waking up.",
    care:
      "Add 4–6 drops to a diffuser or a bowl of steaming water for a quick inhalation. Avoid direct contact with eyes and mucous membranes.",
  },
  {
    slug: "neem-honey-healing-balm",
    name: "Neem & Honey Healing Balm",
    price: 1500,
    category: "Tinctures & Tonics",
    material: "Balm",
    color: "Neem & Turmeric",
    stock: "low",
    bestseller: true,
    images: [neemBalm, turmeric, ashwagandha],
    short: "The little jar your skin keeps asking for.",
    description:
      "Neem leaf and raw honey, worked into a shea and beeswax base with a trace of turmeric. A multi-purpose balm for dry elbows, cracked heels, minor scrapes and anywhere skin needs a little coaxing back to calm.",
    care:
      "Massage a small amount into clean, dry skin as needed. Patch test before first use. Store below 25°C — the balm softens in heat.",
  },
];

export const categories = [
  { name: "Essential Oils", image: lavender, blurb: "Breathe, unwind, restore" },
  { name: "Herbal Teas", image: chamomile, blurb: "A quieter cup" },
  { name: "Supplements", image: ashwagandha, blurb: "Daily roots, steady you" },
  { name: "Tinctures & Tonics", image: turmeric, blurb: "Drop by drop wellness" },
] as const;

export const stockLabel: Record<Stock, string> = {
  in: "In Stock",
  low: "Low Stock",
  out: "Sold Out",
};

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

// PKR currency formatter
export const formatPrice = (value: number) =>
  `Rs ${Math.round(value).toLocaleString("en-PK")}`;
