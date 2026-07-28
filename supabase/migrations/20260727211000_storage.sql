insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('category-images', 'category-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('business-logos', 'business-logos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']),
  ('business-hero-images', 'business-hero-images', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('business-gallery', 'business-gallery', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('product-service-images', 'product-service-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('ad-creatives', 'ad-creatives', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy public_reads_editorial_images
on storage.objects for select
using (bucket_id in (
  'category-images',
  'business-logos',
  'business-hero-images',
  'business-gallery',
  'product-service-images',
  'ad-creatives'
));

create policy editorial_uploads_images
on storage.objects for insert
to authenticated
with check (
  bucket_id in (
    'category-images',
    'business-logos',
    'business-hero-images',
    'business-gallery',
    'product-service-images'
  )
  and public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[])
  and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}\\.(jpg|jpeg|png|webp|avif|svg)$'
);

create policy admins_upload_ad_creatives
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'ad-creatives'
  and public.has_admin_role(array['super_admin', 'admin']::public.admin_role[])
  and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}\\.(jpg|jpeg|png|webp|avif)$'
);

create policy editorial_updates_images
on storage.objects for update
to authenticated
using (
  bucket_id in (
    'category-images',
    'business-logos',
    'business-hero-images',
    'business-gallery',
    'product-service-images'
  )
  and public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[])
)
with check (
  bucket_id in (
    'category-images',
    'business-logos',
    'business-hero-images',
    'business-gallery',
    'product-service-images'
  )
  and public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[])
);

create policy admins_update_ad_creatives
on storage.objects for update
to authenticated
using (
  bucket_id = 'ad-creatives'
  and public.has_admin_role(array['super_admin', 'admin']::public.admin_role[])
)
with check (
  bucket_id = 'ad-creatives'
  and public.has_admin_role(array['super_admin', 'admin']::public.admin_role[])
);

create policy editorial_deletes_images
on storage.objects for delete
to authenticated
using (
  bucket_id in (
    'category-images',
    'business-logos',
    'business-hero-images',
    'business-gallery',
    'product-service-images'
  )
  and public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[])
);

create policy admins_delete_ad_creatives
on storage.objects for delete
to authenticated
using (
  bucket_id = 'ad-creatives'
  and public.has_admin_role(array['super_admin', 'admin']::public.admin_role[])
);
