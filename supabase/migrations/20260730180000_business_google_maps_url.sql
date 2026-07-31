alter table public.businesses
  add column if not exists google_maps_url text;

alter table public.businesses
  add constraint businesses_google_maps_url_check
  check (
    google_maps_url is null
    or google_maps_url ~ '^https://(www\.)?(google\.com/maps|maps\.google\.com|maps\.app\.goo\.gl|goo\.gl/maps)'
  );
