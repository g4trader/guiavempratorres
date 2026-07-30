create type public.business_item_type as enum (
  'PRODUCT',
  'SERVICE',
  'PROMOTION',
  'MENU',
  'CATALOG'
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 100),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  max_images integer not null default 1 check (max_images >= 0),
  max_items integer not null default 0 check (max_items >= 0),
  featured_home boolean not null default false,
  featured_category boolean not null default false,
  hero_allowed boolean not null default false,
  priority integer not null default 0,
  whatsapp_enabled boolean not null default false,
  website_enabled boolean not null default false,
  instagram_enabled boolean not null default false,
  gallery_enabled boolean not null default false,
  video_enabled boolean not null default false,
  premium_badge boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.plans (
  id,
  name,
  slug,
  max_images,
  max_items,
  featured_home,
  featured_category,
  hero_allowed,
  priority,
  whatsapp_enabled,
  website_enabled,
  instagram_enabled,
  gallery_enabled,
  video_enabled,
  premium_badge
) values (
  '50000000-0000-0000-0000-000000000001',
  'Plano Inicial',
  'plano-inicial',
  10,
  20,
  true,
  true,
  true,
  10,
  true,
  true,
  true,
  true,
  false,
  false
);

alter table public.businesses
  add column plan_id uuid references public.plans(id) on delete restrict;

update public.businesses
set plan_id = '50000000-0000-0000-0000-000000000001'
where plan_id is null;

alter table public.businesses alter column plan_id set not null;

create index businesses_plan_idx on public.businesses (plan_id);

create table public.business_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  type public.business_item_type not null,
  title text not null check (char_length(trim(title)) between 2 and 140),
  description text,
  image text,
  price numeric(12, 2) check (price is null or price >= 0),
  cta_label text,
  cta_url text,
  display_order integer not null default 0 check (display_order >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((cta_label is null) = (cta_url is null))
);

create index business_items_listing_idx
  on public.business_items (business_id, active, display_order);

insert into public.business_items (
  id,
  business_id,
  type,
  title,
  description,
  image,
  price,
  cta_label,
  cta_url,
  display_order,
  active,
  created_at,
  updated_at
)
select
  id,
  business_id,
  case type
    when 'product' then 'PRODUCT'::public.business_item_type
    else 'SERVICE'::public.business_item_type
  end,
  name,
  description,
  image_path,
  price,
  cta_label,
  cta_url,
  display_order,
  is_active,
  created_at,
  updated_at
from public.products_services;

create trigger plans_updated_at before update on public.plans
for each row execute function public.set_updated_at();

create trigger business_items_updated_at before update on public.business_items
for each row execute function public.set_updated_at();

create trigger plans_audit after insert or update or delete on public.plans
for each row execute function public.record_audit_log();

create trigger business_items_audit after insert or update or delete on public.business_items
for each row execute function public.record_audit_log();

alter table public.plans enable row level security;
alter table public.business_items enable row level security;

create policy public_reads_plans on public.plans for select using (true);

create policy public_reads_active_business_items on public.business_items for select
using (
  active
  and exists (
    select 1
    from public.businesses
    where businesses.id = business_id
      and businesses.status = 'published'
      and businesses.published_at <= now()
  )
);

create policy editorial_manages_plans on public.plans for all
using (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]));

create policy editorial_manages_business_items on public.business_items for all
using (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]));
