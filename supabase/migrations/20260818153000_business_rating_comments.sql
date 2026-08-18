alter table public.business_ratings
  add column comment varchar(150);

create index business_ratings_business_recent_idx
  on public.business_ratings (business_id, updated_at desc);

create or replace function public.get_public_business_reviews(
  p_business_id uuid,
  p_offset integer default 0,
  p_limit integer default 10
)
returns table (rating smallint, comment varchar, created_at timestamptz, total_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    ratings.rating,
    ratings.comment,
    ratings.updated_at as created_at,
    count(*) over () as total_count
  from public.business_ratings as ratings
  join public.businesses as businesses on businesses.id = ratings.business_id
  where ratings.business_id = p_business_id
    and businesses.status = 'published'
    and businesses.published_at <= now()
  order by ratings.updated_at desc
  offset greatest(p_offset, 0)
  limit least(greatest(p_limit, 1), 10);
$$;

revoke all on function public.get_public_business_reviews(uuid, integer, integer) from public;
grant execute on function public.get_public_business_reviews(uuid, integer, integer) to anon, authenticated;
