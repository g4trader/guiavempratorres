create extension if not exists pgcrypto;

create type public.admin_role as enum ('super_admin', 'admin', 'editor');
create type public.business_status as enum ('draft', 'published', 'suspended', 'archived');
create type public.item_type as enum ('product', 'service');
create type public.campaign_status as enum ('draft', 'active', 'paused', 'archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role public.admin_role not null,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  image_path text,
  image_alt text,
  display_order integer not null default 0 check (display_order >= 0),
  is_active boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (image_path is null or nullif(trim(image_alt), '') is not null)
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 140),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  short_description text,
  description text,
  logo_path text,
  hero_image_path text,
  hero_image_alt text,
  status public.business_status not null default 'draft',
  address_line text,
  neighborhood text,
  city text not null default 'Torres',
  state char(2) not null default 'RS',
  postal_code text,
  latitude numeric(9,6) check (latitude between -90 and 90),
  longitude numeric(9,6) check (longitude between -180 and 180),
  phone text,
  whatsapp text,
  email text,
  website_url text,
  instagram_url text,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((latitude is null) = (longitude is null)),
  check (hero_image_path is null or nullif(trim(hero_image_alt), '') is not null),
  check (status <> 'published' or published_at is not null)
);

create table public.business_categories (
  business_id uuid not null references public.businesses(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  is_primary boolean not null default false,
  primary key (business_id, category_id)
);

create unique index one_primary_category_per_business
  on public.business_categories (business_id) where is_primary;

create table public.business_contacts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  kind text not null check (kind in ('phone', 'whatsapp', 'email', 'website', 'instagram')),
  label text,
  value text not null,
  display_order integer not null default 0 check (display_order >= 0),
  is_active boolean not null default true
);

create table public.business_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  unique (business_id, day_of_week),
  check (is_closed or (opens_at is not null and closes_at is not null))
);

create table public.business_media (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  kind text not null check (kind in ('logo', 'hero', 'gallery')),
  storage_path text not null,
  alt_text text not null check (nullif(trim(alt_text), '') is not null),
  display_order integer not null default 0 check (display_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.products_services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  type public.item_type not null,
  name text not null,
  description text,
  image_path text,
  image_alt text,
  price numeric(12,2) check (price is null or price >= 0),
  currency char(3) not null default 'BRL',
  cta_label text,
  cta_url text,
  display_order integer not null default 0 check (display_order >= 0),
  is_active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (image_path is null or nullif(trim(image_alt), '') is not null)
);

create table public.ad_placements (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  max_active smallint not null check (max_active between 1 and 20),
  created_at timestamptz not null default now()
);

create table public.ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  placement_id uuid not null references public.ad_placements(id) on delete restrict,
  status public.campaign_status not null default 'draft',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  priority integer not null default 0,
  display_order integer not null default 0 check (display_order >= 0),
  internal_path text not null check (internal_path ~ '^/empresas/[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index ad_campaigns_active_lookup
  on public.ad_campaigns (placement_id, starts_at, ends_at, display_order)
  where status = 'active';

create table public.ad_creatives (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.ad_campaigns(id) on delete cascade,
  desktop_image_path text not null,
  mobile_image_path text,
  alt_text text not null check (nullif(trim(alt_text), '') is not null),
  title text,
  supporting_text text,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_table text not null,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();
create trigger businesses_updated_at before update on public.businesses
for each row execute function public.set_updated_at();
create trigger products_services_updated_at before update on public.products_services
for each row execute function public.set_updated_at();
create trigger ad_campaigns_updated_at before update on public.ad_campaigns
for each row execute function public.set_updated_at();

create or replace function public.enforce_ad_placement_capacity()
returns trigger language plpgsql set search_path = public as $$
declare capacity integer; overlapping integer;
begin
  if new.status <> 'active' then return new; end if;
  perform pg_advisory_xact_lock(hashtext(new.placement_id::text));
  select max_active into capacity from public.ad_placements where id = new.placement_id;
  select count(*) into overlapping
    from public.ad_campaigns c
    where c.placement_id = new.placement_id
      and c.status = 'active'
      and c.id <> new.id
      and tstzrange(c.starts_at, c.ends_at, '[)') && tstzrange(new.starts_at, new.ends_at, '[)');
  if overlapping >= capacity then
    raise exception 'placement capacity exceeded';
  end if;
  return new;
end;
$$;

create trigger ad_campaign_capacity before insert or update on public.ad_campaigns
for each row execute function public.enforce_ad_placement_capacity();

create or replace function public.has_admin_role(allowed public.admin_role[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admin_roles
    where user_id = auth.uid() and role = any(allowed)
  );
$$;

alter table public.profiles enable row level security;
alter table public.admin_roles enable row level security;
alter table public.categories enable row level security;
alter table public.businesses enable row level security;
alter table public.business_categories enable row level security;
alter table public.business_contacts enable row level security;
alter table public.business_hours enable row level security;
alter table public.business_media enable row level security;
alter table public.products_services enable row level security;
alter table public.ad_placements enable row level security;
alter table public.ad_campaigns enable row level security;
alter table public.ad_creatives enable row level security;
alter table public.audit_logs enable row level security;

create policy "public reads active categories" on public.categories for select using (is_active);
create policy "public reads published businesses" on public.businesses for select using (status = 'published');
create policy "public reads published business categories" on public.business_categories for select using (
  exists (select 1 from public.businesses b where b.id = business_id and b.status = 'published')
);
create policy "public reads active business contacts" on public.business_contacts for select using (
  is_active and exists (select 1 from public.businesses b where b.id = business_id and b.status = 'published')
);
create policy "public reads business hours" on public.business_hours for select using (
  exists (select 1 from public.businesses b where b.id = business_id and b.status = 'published')
);
create policy "public reads active business media" on public.business_media for select using (
  is_active and exists (select 1 from public.businesses b where b.id = business_id and b.status = 'published')
);
create policy "public reads active items" on public.products_services for select using (
  is_active and deleted_at is null and exists (select 1 from public.businesses b where b.id = business_id and b.status = 'published')
);
create policy "public reads ad placements" on public.ad_placements for select using (true);
create policy "public reads current campaigns" on public.ad_campaigns for select using (
  status = 'active' and starts_at <= now() and ends_at > now()
);
create policy "public reads current creatives" on public.ad_creatives for select using (
  exists (select 1 from public.ad_campaigns c where c.id = campaign_id and c.status = 'active' and c.starts_at <= now() and c.ends_at > now())
);

create policy "admins manage categories" on public.categories for all
using (public.has_admin_role(array['super_admin','admin','editor']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin','admin','editor']::public.admin_role[]));
create policy "admins manage businesses" on public.businesses for all
using (public.has_admin_role(array['super_admin','admin','editor']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin','admin','editor']::public.admin_role[]));
create policy "super admins manage roles" on public.admin_roles for all
using (public.has_admin_role(array['super_admin']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin']::public.admin_role[]));
create policy "users read own profile" on public.profiles for select using (id = auth.uid());

insert into public.ad_placements (code, name, max_active)
values ('HOME_HERO', 'Hero da página inicial', 5);
