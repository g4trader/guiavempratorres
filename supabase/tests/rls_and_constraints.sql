begin;
select plan(5);
select has_table('public', 'businesses', 'businesses existe');
select has_column('public', 'businesses', 'status', 'businesses possui status');
select policies_are('public', 'categories', array['admins manage categories', 'public reads active categories']);
select policies_are('public', 'businesses', array['admins manage businesses', 'public reads published businesses']);
select throws_ok(
  $$ insert into public.ad_campaigns (business_id, placement_id, status, starts_at, ends_at, internal_path)
     values ('20000000-0000-0000-0000-000000000001', (select id from public.ad_placements where code='HOME_HERO'),
       'active', now(), now() - interval '1 day', '/empresas/sabores-da-praia') $$,
  '23514',
  null,
  'impede período inválido'
);
select * from finish();
rollback;
