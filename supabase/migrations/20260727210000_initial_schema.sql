create extension if not exists pgcrypto;

create type public.admin_role as enum ('super_admin', 'admin', 'editor');
create type public.business_status as enum ('draft', 'published', 'suspended', 'archived');
create type public.item_type as enum ('product', 'service');
create type public.campaign_status as enum ('draft', 'active', 'paused', 'archived');
create type public.media_kind as enum ('logo', 'hero', 'gallery');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role public.admin_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 100),
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
  name text not null check (char_length(trim(name)) between 2 and 140),
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
  state char(2) not null default 'RS' check (state ~ '^[A-Z]{2}$'),
  postal_code text,
  latitude numeric(9, 6) check (latitude between -90 and 90),
  longitude numeric(9, 6) check (longitude between -180 and 180),
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

create index businesses_public_listing_idx
  on public.businesses (status, published_at desc, name);

create table public.business_categories (
  business_id uuid not null references public.businesses(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (business_id, category_id)
);

create index business_categories_category_idx
  on public.business_categories (category_id, business_id);
create unique index one_primary_category_per_business
  on public.business_categories (business_id) where is_primary;

create table public.business_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, day_of_week),
  check (
    (is_closed and opens_at is null and closes_at is null)
    or (not is_closed and opens_at is not null and closes_at is not null and closes_at > opens_at)
  )
);

create table public.business_media (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  kind public.media_kind not null,
  storage_path text not null,
  image_alt text not null check (nullif(trim(image_alt), '') is not null),
  display_order integer not null default 0 check (display_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, storage_path)
);

create index business_media_listing_idx
  on public.business_media (business_id, kind, is_active, display_order);

create table public.products_services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  type public.item_type not null,
  name text not null check (char_length(trim(name)) between 2 and 140),
  description text,
  image_path text,
  image_alt text,
  price numeric(12, 2) check (price is null or price >= 0),
  currency char(3) not null default 'BRL' check (currency ~ '^[A-Z]{3}$'),
  cta_label text,
  cta_url text,
  display_order integer not null default 0 check (display_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (image_path is null or nullif(trim(image_alt), '') is not null),
  check ((cta_label is null) = (cta_url is null))
);

create index products_services_public_idx
  on public.products_services (business_id, is_active, display_order);

create table public.ad_placements (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z][A-Z0-9_]*$'),
  name text not null,
  maximum_active_ads smallint not null check (maximum_active_ads between 1 and 20),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  placement_id uuid not null references public.ad_placements(id) on delete restrict,
  status public.campaign_status not null default 'draft',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  display_order integer not null default 0 check (display_order >= 0),
  priority integer not null default 0,
  internal_path text not null check (internal_path ~ '^/empresas/[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index ad_campaigns_public_idx
  on public.ad_campaigns (placement_id, status, starts_at, ends_at, priority desc, display_order);

create table public.ad_creatives (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null unique references public.ad_campaigns(id) on delete cascade,
  desktop_image_path text not null,
  mobile_image_path text,
  image_alt text not null check (nullif(trim(image_alt), '') is not null),
  title text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  entity_table text not null,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_entity_idx on public.audit_logs (entity_table, entity_id, created_at desc);
create index audit_logs_actor_idx on public.audit_logs (actor_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger admin_roles_updated_at before update on public.admin_roles
for each row execute function public.set_updated_at();
create trigger categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();
create trigger businesses_updated_at before update on public.businesses
for each row execute function public.set_updated_at();
create trigger business_hours_updated_at before update on public.business_hours
for each row execute function public.set_updated_at();
create trigger business_media_updated_at before update on public.business_media
for each row execute function public.set_updated_at();
create trigger products_services_updated_at before update on public.products_services
for each row execute function public.set_updated_at();
create trigger ad_placements_updated_at before update on public.ad_placements
for each row execute function public.set_updated_at();
create trigger ad_campaigns_updated_at before update on public.ad_campaigns
for each row execute function public.set_updated_at();
create trigger ad_creatives_updated_at before update on public.ad_creatives
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.enforce_ad_placement_capacity()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  placement_limit integer;
  overlapping_count integer;
  placement_enabled boolean;
begin
  if new.status <> 'active' then
    return new;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(new.placement_id::text, 0));

  select maximum_active_ads, is_active
    into placement_limit, placement_enabled
    from public.ad_placements
   where id = new.placement_id
   for update;

  if placement_limit is null or not placement_enabled then
    raise exception using
      errcode = '23514',
      message = 'active campaigns require an active placement';
  end if;

  select count(*)
    into overlapping_count
    from public.ad_campaigns campaign
   where campaign.placement_id = new.placement_id
     and campaign.status = 'active'
     and campaign.id <> new.id
     and tstzrange(campaign.starts_at, campaign.ends_at, '[)')
       && tstzrange(new.starts_at, new.ends_at, '[)');

  if overlapping_count >= placement_limit then
    raise exception using
      errcode = '23514',
      message = 'ad placement capacity exceeded';
  end if;

  return new;
end;
$$;

create trigger ad_campaign_capacity
before insert or update of placement_id, status, starts_at, ends_at
on public.ad_campaigns
for each row execute function public.enforce_ad_placement_capacity();

create or replace function public.has_admin_role(allowed public.admin_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from public.admin_roles
     where user_id = auth.uid()
       and role = any(allowed)
  );
$$;

revoke all on function public.has_admin_role(public.admin_role[]) from public;
grant execute on function public.has_admin_role(public.admin_role[]) to anon, authenticated;

create or replace function public.record_audit_log()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.audit_logs (actor_id, action, entity_table, entity_id, old_data, new_data)
  values (
    auth.uid(),
    tg_op,
    tg_table_name,
    coalesce(new.id, old.id),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end
  );
  return coalesce(new, old);
end;
$$;

create trigger categories_audit after insert or update or delete on public.categories
for each row execute function public.record_audit_log();
create trigger businesses_audit after insert or update or delete on public.businesses
for each row execute function public.record_audit_log();
create trigger products_services_audit after insert or update or delete on public.products_services
for each row execute function public.record_audit_log();
create trigger ad_campaigns_audit after insert or update or delete on public.ad_campaigns
for each row execute function public.record_audit_log();

alter table public.profiles enable row level security;
alter table public.admin_roles enable row level security;
alter table public.categories enable row level security;
alter table public.businesses enable row level security;
alter table public.business_categories enable row level security;
alter table public.business_hours enable row level security;
alter table public.business_media enable row level security;
alter table public.products_services enable row level security;
alter table public.ad_placements enable row level security;
alter table public.ad_campaigns enable row level security;
alter table public.ad_creatives enable row level security;
alter table public.audit_logs enable row level security;

create policy profiles_read_own on public.profiles for select
using (id = auth.uid() or public.has_admin_role(array['super_admin', 'admin']::public.admin_role[]));
create policy profiles_update_own on public.profiles for update
using (id = auth.uid()) with check (id = auth.uid());
create policy super_admin_manages_roles on public.admin_roles for all
using (public.has_admin_role(array['super_admin']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin']::public.admin_role[]));

create policy public_reads_active_categories on public.categories for select using (is_active);
create policy public_reads_published_businesses on public.businesses for select
using (status = 'published' and published_at <= now());
create policy public_reads_published_business_categories on public.business_categories for select
using (exists (
  select 1 from public.businesses
   where businesses.id = business_id
     and businesses.status = 'published'
     and businesses.published_at <= now()
));
create policy public_reads_published_business_hours on public.business_hours for select
using (exists (
  select 1 from public.businesses
   where businesses.id = business_id
     and businesses.status = 'published'
     and businesses.published_at <= now()
));
create policy public_reads_active_business_media on public.business_media for select
using (is_active and exists (
  select 1 from public.businesses
   where businesses.id = business_id
     and businesses.status = 'published'
     and businesses.published_at <= now()
));
create policy public_reads_active_products_services on public.products_services for select
using (is_active and exists (
  select 1 from public.businesses
   where businesses.id = business_id
     and businesses.status = 'published'
     and businesses.published_at <= now()
));
create policy public_reads_active_placements on public.ad_placements for select using (is_active);
create policy public_reads_current_campaigns on public.ad_campaigns for select
using (
  status = 'active'
  and starts_at <= now()
  and ends_at > now()
  and exists (
    select 1 from public.businesses
     where businesses.id = business_id
       and businesses.status = 'published'
       and businesses.published_at <= now()
  )
  and exists (
    select 1 from public.ad_placements
     where ad_placements.id = placement_id and ad_placements.is_active
  )
);
create policy public_reads_current_creatives on public.ad_creatives for select
using (exists (
  select 1
    from public.ad_campaigns
    join public.businesses on businesses.id = ad_campaigns.business_id
    join public.ad_placements on ad_placements.id = ad_campaigns.placement_id
   where ad_campaigns.id = campaign_id
     and ad_campaigns.status = 'active'
     and ad_campaigns.starts_at <= now()
     and ad_campaigns.ends_at > now()
     and businesses.status = 'published'
     and businesses.published_at <= now()
     and ad_placements.is_active
));

create policy editorial_manages_categories on public.categories for all
using (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]));
create policy editorial_manages_businesses on public.businesses for all
using (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]));
create policy editorial_manages_business_categories on public.business_categories for all
using (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]));
create policy editorial_manages_business_hours on public.business_hours for all
using (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]));
create policy editorial_manages_business_media on public.business_media for all
using (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]));
create policy editorial_manages_products_services on public.products_services for all
using (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]));

create policy admins_manage_placements on public.ad_placements for all
using (public.has_admin_role(array['super_admin', 'admin']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin', 'admin']::public.admin_role[]));
create policy admins_manage_campaigns on public.ad_campaigns for all
using (public.has_admin_role(array['super_admin', 'admin']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin', 'admin']::public.admin_role[]));
create policy admins_manage_creatives on public.ad_creatives for all
using (public.has_admin_role(array['super_admin', 'admin']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin', 'admin']::public.admin_role[]));
create policy admins_read_audit_logs on public.audit_logs for select
using (public.has_admin_role(array['super_admin', 'admin']::public.admin_role[]));

insert into public.ad_placements (code, name, maximum_active_ads, is_active)
values ('HOME_HERO', 'Hero da página inicial', 5, true);
