-- HerbHealth schema migration
-- Run this in the Supabase SQL editor

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  category_id uuid references categories(id),
  material text,
  color text,
  sizes text[],
  stock_status text not null default 'in' check (stock_status in ('in','low','out')),
  stock_quantity integer default 0,
  is_bestseller boolean not null default false,
  is_active boolean not null default true,
  short_description text,
  description text,
  care_instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  status text not null default 'pending' check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  customer_name text not null,
  phone text not null,
  email text,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  area text,
  postal_code text,
  notes text,
  subtotal numeric(10,2) not null,
  shipping_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  payment_method text not null default 'cod',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  variant text,
  unit_price numeric(10,2) not null,
  quantity integer not null,
  line_total numeric(10,2) not null
);

-- Settings table for store config (shipping fee, thresholds, etc.)
create table settings (
  key text primary key,
  value text not null
);
insert into settings (key, value) values
  ('shipping_fee', '200'),
  ('free_shipping_threshold', '3000'),
  ('store_phone', ''),
  ('store_whatsapp', '');

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger products_updated_at before update on products
  for each row execute function set_updated_at();
create trigger orders_updated_at before update on orders
  for each row execute function set_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table settings enable row level security;

-- categories: public read
create policy "public read categories" on categories for select using (true);

-- products: public read only active
create policy "public read active products" on products for select using (is_active = true);

-- product_images: public read
create policy "public read product_images" on product_images for select using (true);

-- orders / order_items: NO public access — all access via service role in server functions
-- (service role bypasses RLS by default in Supabase)

-- settings: public read
create policy "public read settings" on settings for select using (true);

-- ─── Storage bucket ───────────────────────────────────────────────────────────
-- Create a public bucket named "product-images" in the Supabase dashboard:
--   Storage → New bucket → name: product-images → Public: ON
-- Then add a storage policy: allow public SELECT (read), restrict INSERT/DELETE to service role.
