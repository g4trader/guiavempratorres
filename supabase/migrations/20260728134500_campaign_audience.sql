alter table public.ad_campaigns
  add column if not exists audience text not null default 'HOME'
  check (audience in ('HOME', 'SITE', 'CATEGORIES'));

create table if not exists public.ad_campaign_categories (
  campaign_id uuid not null references public.ad_campaigns(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (campaign_id, category_id)
);

create index if not exists ad_campaign_categories_category_idx
  on public.ad_campaign_categories (category_id, campaign_id);

alter table public.ad_campaign_categories enable row level security;

drop policy if exists public_reads_campaign_categories on public.ad_campaign_categories;
create policy public_reads_campaign_categories
on public.ad_campaign_categories for select
using (
  exists (
    select 1
    from public.ad_campaigns
    where ad_campaigns.id = campaign_id
      and ad_campaigns.status = 'active'
      and ad_campaigns.starts_at <= now()
      and ad_campaigns.ends_at > now()
  )
);

drop policy if exists admins_manage_campaign_categories on public.ad_campaign_categories;
create policy admins_manage_campaign_categories
on public.ad_campaign_categories for all
using (public.has_admin_role(array['super_admin', 'admin']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin', 'admin']::public.admin_role[]));
