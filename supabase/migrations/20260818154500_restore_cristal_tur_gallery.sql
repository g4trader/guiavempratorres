insert into public.business_media (
  business_id,
  kind,
  storage_path,
  image_alt,
  display_order,
  is_active
)
select
  businesses.id,
  'gallery'::public.media_kind,
  'business-gallery/aff9cbe0-b4cf-4aa2-863f-5efb8dc6bc8e/0f01d563-4931-434e-b662-799aaacb2924/2b80382c-1439-458f-91da-6fe99f2cdf9b.png',
  'Passeio de balão ao amanhecer',
  0,
  true
from public.businesses as businesses
where businesses.id = 'aff9cbe0-b4cf-4aa2-863f-5efb8dc6bc8e'
  and businesses.slug = 'cristal-tur'
  and not exists (
    select 1
    from public.business_media
    where storage_path = 'business-gallery/aff9cbe0-b4cf-4aa2-863f-5efb8dc6bc8e/0f01d563-4931-434e-b662-799aaacb2924/2b80382c-1439-458f-91da-6fe99f2cdf9b.png'
  );
