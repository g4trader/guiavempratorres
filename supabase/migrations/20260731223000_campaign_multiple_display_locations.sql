alter table public.ad_campaigns
  add column if not exists display_locations text[] not null default array['HOME']::text[];

update public.ad_campaigns
set display_locations = array[audience]::text[];

alter table public.ad_campaigns
  add constraint ad_campaigns_display_locations_check
  check (
    cardinality(display_locations) > 0
    and display_locations <@ array['HOME', 'SITE', 'CATEGORIES', 'TOURIST_ATTRACTIONS']::text[]
    and (
      not ('SITE' = any(display_locations))
      or cardinality(display_locations) = 1
    )
  );
