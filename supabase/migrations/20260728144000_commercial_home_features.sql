alter table public.businesses
  add column if not exists featured_home boolean not null default false,
  add column if not exists featured_home_order integer not null default 0
    check (featured_home_order >= 0),
  add column if not exists featured_home_starts_at timestamptz,
  add column if not exists featured_home_ends_at timestamptz;

alter table public.businesses
  drop constraint if exists businesses_featured_home_period_check;

alter table public.businesses
  add constraint businesses_featured_home_period_check
  check (
    featured_home_starts_at is null
    or featured_home_ends_at is null
    or featured_home_ends_at > featured_home_starts_at
  );

create index if not exists businesses_featured_home_idx
  on public.businesses (featured_home, featured_home_order, featured_home_starts_at, featured_home_ends_at)
  where featured_home;

update public.businesses
set featured_home = true
where status = 'published'
  and plan_id in (select id from public.plans where featured_home);

update public.ad_campaigns
set audience = 'SITE'
where status = 'active'
  and audience = 'HOME';
