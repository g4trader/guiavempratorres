alter policy editorial_uploads_images
on storage.objects
with check (
  bucket_id in (
    'category-images',
    'business-logos',
    'business-hero-images',
    'business-gallery',
    'product-service-images'
  )
  and public.has_admin_role(array['super_admin', 'admin', 'editor']::public.admin_role[])
  and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|jpeg|png|webp|avif|svg)$'
);

alter policy admins_upload_ad_creatives
on storage.objects
with check (
  bucket_id = 'ad-creatives'
  and public.has_admin_role(array['super_admin', 'admin']::public.admin_role[])
  and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|jpeg|png|webp|avif)$'
);
