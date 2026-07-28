alter table public.businesses
  add column rating_average numeric(3, 2) not null default 5.00
    check (rating_average between 1 and 5),
  add column rating_count integer not null default 0
    check (rating_count >= 0);

create table public.business_ratings (
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (business_id, user_id)
);

create index business_ratings_business_idx
  on public.business_ratings (business_id);

create or replace function public.refresh_business_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_business_id uuid := coalesce(new.business_id, old.business_id);
begin
  update public.businesses
     set rating_average = coalesce(
           (select round(avg(rating)::numeric, 2)
              from public.business_ratings
             where business_id = target_business_id),
           5.00
         ),
         rating_count = (
           select count(*)::integer
             from public.business_ratings
            where business_id = target_business_id
         )
   where id = target_business_id;

  return coalesce(new, old);
end;
$$;

create trigger business_ratings_refresh
after insert or update or delete on public.business_ratings
for each row execute function public.refresh_business_rating();

alter table public.business_ratings enable row level security;

create policy users_read_own_business_ratings
on public.business_ratings for select
to authenticated
using (user_id = auth.uid());

create policy users_create_own_business_ratings
on public.business_ratings for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
      from public.businesses
     where businesses.id = business_id
       and businesses.status = 'published'
       and businesses.published_at <= now()
  )
);

create policy users_update_own_business_ratings
on public.business_ratings for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy users_delete_own_business_ratings
on public.business_ratings for delete
to authenticated
using (user_id = auth.uid());

grant select, insert, update, delete on public.business_ratings to authenticated;
