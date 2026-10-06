-- Seed data: categories and 6 sample products (PKR pricing)
-- Run after 001_initial_schema.sql
-- NOTE: Images must be uploaded manually to the product-images bucket.
-- Use the storage_path format: products/{slug}/{filename}

insert into categories (name, slug) values
  ('Essential Oils', 'essential-oils'),
  ('Herbal Teas', 'herbal-teas'),
  ('Supplements', 'supplements'),
  ('Tinctures & Tonics', 'tinctures-tonics');

-- Insert products (images added separately via admin dashboard)
insert into products (slug, name, price, compare_at_price, category_id, material, color, sizes, stock_status, stock_quantity, is_bestseller, short_description, description, care_instructions) values
(
  'golden-turmeric-elixir-drops',
  'Golden Turmeric Elixir Drops',
  2900, 3400,
  (select id from categories where slug = 'tinctures-tonics'),
  'Liquid Tincture', 'Turmeric & Black Pepper',
  array['30ml','60ml'],
  'in', 40, true,
  'A daily dropper of warmth, straight from the root.',
  'Cold-extracted turmeric root blended with black pepper for absorption and a whisper of raw honey. Three drops under the tongue or stirred into warm water brings a gentle, grounding lift to your morning ritual.',
  'Take 2–3 drops daily, morning or evening, diluted in water or tea. Store in a cool, dark place away from direct sunlight. Shake well before use.'
),
(
  'lavender-calm-essential-oil',
  'Lavender Calm Essential Oil',
  1800, null,
  (select id from categories where slug = 'essential-oils'),
  'Essential Oil', 'Lavender',
  null,
  'low', 6, true,
  'Slow your evening down, one deep breath at a time.',
  'Steam-distilled from high-altitude lavender flowers, this oil is calm in a bottle. A few drops in a diffuser, on a pillow, or blended into a carrier oil for the temples turns any room into a wind-down ritual.',
  'For diffusing: 4–5 drops in water. For topical use, dilute with a carrier oil. Keep out of direct sunlight and away from children.'
),
(
  'ashwagandha-root-capsules',
  'Ashwagandha Root Capsules',
  2400, null,
  (select id from categories where slug = 'supplements'),
  'Capsules', 'Ashwagandha 500mg',
  null,
  'in', 35, true,
  'Steadier days start with a steadier root.',
  'Organically grown ashwagandha root, milled and encapsulated at 500mg per serving. A traditional adaptogen taken daily to support a calmer response to everyday stress and steadier energy through the day.',
  'Take 1 capsule twice daily with meals, or as advised by your healthcare provider. Not recommended during pregnancy without medical guidance.'
),
(
  'chamomile-wellness-tea',
  'Chamomile Wellness Tea',
  1200, null,
  (select id from categories where slug = 'herbal-teas'),
  'Loose Leaf Tea', 'Chamomile & Honey',
  array['50g Pouch','100g Pouch'],
  'in', 50, true,
  'The last cup before the lights go out.',
  'Whole chamomile flowers hand-blended with lemon balm and a touch of dried honey granules. Steeped for five minutes, it''s the quiet close to a loud day — caffeine-free and gentle on the stomach.',
  'Steep 1 tsp in hot water (not boiling) for 4–5 minutes. Best enjoyed 30 minutes before bed. Store in an airtight container away from light.'
),
(
  'eucalyptus-breathe-easy-oil',
  'Eucalyptus Breathe Easy Oil',
  1900, null,
  (select id from categories where slug = 'essential-oils'),
  'Essential Oil', 'Eucalyptus & Mint',
  null,
  'in', 28, true,
  'One breath in, and the room feels bigger.',
  'A bracing blend of eucalyptus and peppermint, distilled to clear the head and open the chest. Reach for it during flu season, before a workout, or whenever a room needs waking up.',
  'Add 4–6 drops to a diffuser or a bowl of steaming water for a quick inhalation. Avoid direct contact with eyes and mucous membranes.'
),
(
  'neem-honey-healing-balm',
  'Neem & Honey Healing Balm',
  1500, null,
  (select id from categories where slug = 'tinctures-tonics'),
  'Balm', 'Neem & Turmeric',
  null,
  'low', 9, true,
  'The little jar your skin keeps asking for.',
  'Neem leaf and raw honey, worked into a shea and beeswax base with a trace of turmeric. A multi-purpose balm for dry elbows, cracked heels, minor scrapes and anywhere skin needs a little coaxing back to calm.',
  'Massage a small amount into clean, dry skin as needed. Patch test before first use. Store below 25°C — the balm softens in heat.'
);
