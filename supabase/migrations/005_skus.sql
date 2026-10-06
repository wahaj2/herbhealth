alter table products add column sku text unique;
alter table product_variants add column sku text unique;
alter table order_items add column sku text; -- snapshot, no uniqueness needed