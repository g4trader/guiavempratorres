alter table public.ad_campaigns
  drop constraint if exists ad_campaigns_audience_check;

alter table public.ad_campaigns
  add constraint ad_campaigns_audience_check
  check (audience in ('HOME', 'SITE', 'CATEGORIES', 'TOURIST_ATTRACTIONS'));
