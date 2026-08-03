alter table public.ad_campaigns
  add column if not exists destination_type text not null default 'INTERNAL',
  add column if not exists destination_url text;

update public.ad_campaigns
set destination_url = internal_path
where destination_url is null or destination_url = '';

alter table public.ad_campaigns
  alter column destination_url set not null,
  add constraint ad_campaigns_destination_type_check
    check (destination_type in ('INTERNAL', 'EXTERNAL')),
  add constraint ad_campaigns_destination_url_check
    check (
      (destination_type = 'INTERNAL' and destination_url ~ '^/empresas/[a-z0-9]+(?:-[a-z0-9]+)*$')
      or
      (destination_type = 'EXTERNAL' and destination_url ~* '^https?://')
    );
