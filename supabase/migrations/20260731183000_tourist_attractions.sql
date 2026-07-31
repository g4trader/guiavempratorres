create table public.tourist_attractions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (nullif(trim(title), '') is not null),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text,
  card_image_path text,
  card_image_alt text,
  content_blocks jsonb not null default '[]'::jsonb check (jsonb_typeof(content_blocks) = 'array'),
  google_maps_url text,
  address_line text,
  neighborhood text,
  city text,
  state text,
  postal_code text,
  latitude numeric(9, 6) check (latitude between -90 and 90),
  longitude numeric(9, 6) check (longitude between -180 and 180),
  status public.business_status not null default 'draft',
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((latitude is null) = (longitude is null)),
  check ((card_image_path is null) = (card_image_alt is null)),
  check (
    google_maps_url is null
    or google_maps_url ~ '^https://(www\.)?(google\.com/maps|maps\.google\.com|maps\.app\.goo\.gl|goo\.gl/maps)'
  )
);

create index tourist_attractions_public_idx
  on public.tourist_attractions (status, published_at desc, title);

create trigger tourist_attractions_updated_at
before update on public.tourist_attractions
for each row execute function public.set_updated_at();

alter table public.tourist_attractions enable row level security;

create policy public_reads_published_tourist_attractions
on public.tourist_attractions for select
using (status = 'published');

create policy editorial_manages_tourist_attractions
on public.tourist_attractions for all
to authenticated
using (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]))
with check (public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[]));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tourist-attraction-images',
  'tourist-attraction-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy public_reads_tourist_attraction_images
on storage.objects for select
using (bucket_id = 'tourist-attraction-images');

create policy editorial_uploads_tourist_attraction_images
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'tourist-attraction-images'
  and public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[])
  and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|jpeg|png|webp|avif)$'
);

create policy editorial_updates_tourist_attraction_images
on storage.objects for update
to authenticated
using (
  bucket_id = 'tourist-attraction-images'
  and public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[])
)
with check (
  bucket_id = 'tourist-attraction-images'
  and public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[])
);

create policy editorial_deletes_tourist_attraction_images
on storage.objects for delete
to authenticated
using (
  bucket_id = 'tourist-attraction-images'
  and public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[])
);
