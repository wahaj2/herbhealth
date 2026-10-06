create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  color_name text not null,
  color_hex text,          -- e.g. #1a1a1a — drives the swatch dot color
  image_path text,         -- optional: shown when this color is selected
  stock_quantity integer,  -- optional; leave null to not track stock per-color
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table product_variants enable row level security;
create policy "public read product_variants" on product_variants for select using (true);
-- Writes (admin add/edit/remove) go through server functions using the
-- service role key — same pattern as product_images and categories.