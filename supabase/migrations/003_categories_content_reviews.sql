-- 003: category images + cascading category delete + reviews + site content + subscribers

-- Category images (path within the existing "product-images" storage bucket)
alter table categories add column image_path text;

-- Fix: deleting a category currently fails (FK has no ON DELETE rule).
-- Make it cascade so deleting a category deletes its products too
-- (product_images already cascades from products, and order_items already
-- has ON DELETE SET NULL on product_id, so past orders stay intact).
do $$
declare
  con_name text;
begin
  select conname into con_name
  from pg_constraint
  where conrelid = 'products'::regclass
    and confrelid = 'categories'::regclass
    and contype = 'f';
  if con_name is not null then
    execute format('alter table products drop constraint %I', con_name);
  end if;
  alter table products add constraint products_category_id_fkey
    foreign key (category_id) references categories(id) on delete cascade;
end $$;

-- Reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  customer_name text not null,
  customer_email text,
  rating integer not null check (rating between 1 and 5),
  title text,
  comment text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table reviews enable row level security;
create policy "public read approved reviews" on reviews for select using (is_approved = true);
-- Submissions (customer-facing) and moderation (admin) both go through server
-- functions using the service role key — no public insert/update policy needed,
-- same pattern as orders in the Phase 1 schema.

-- Site content & offers (key-value; edited from /admin/content)
create table site_content (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);
alter table site_content enable row level security;
create policy "public read site_content" on site_content for select using (true);
create trigger site_content_updated_at before update on site_content
  for each row execute function set_updated_at();

insert into site_content (key, value) values
  ('hero_eyebrow', 'New Blends · 2026'),
  ('hero_title', 'Natural Wellness & Balanced Living'),
  ('hero_subtitle', 'Small-batch herbal oils, teas and tonics made from real ingredients — for mornings, evenings and everything between.'),
  ('promo_banner_enabled', 'false'),
  ('promo_banner_text', ''),
  ('offer_code', 'HERB10'),
  ('offer_discount_text', '10% off your first order'),
  ('newsletter_heading', 'Join the Roots Club'),
  ('newsletter_subtext', 'Early access to new blends, wellness notes and members-only offers.');

-- Email subscribers (newsletter section + exit-intent popup)
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'newsletter' check (source in ('newsletter', 'exit_intent')),
  created_at timestamptz not null default now()
);
alter table subscribers enable row level security;
-- No public select/insert policy — all access via server functions using the
-- service role key. Duplicate emails are upserted, not rejected (see 4.2).

-- No new storage bucket needed — category images reuse the existing public
-- "product-images" bucket under a "categories/" path prefix.