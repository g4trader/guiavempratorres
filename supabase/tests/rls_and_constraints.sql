begin;

create extension if not exists pgtap with schema extensions;
select plan(16);

select has_table('public', 'businesses', 'businesses existe');
select has_table('public', 'ad_campaigns', 'ad_campaigns existe');
select col_is_unique('public', 'categories', 'slug', 'slug de categoria é único');
select col_is_unique('public', 'businesses', 'slug', 'slug de empresa é único');

insert into auth.users (id, email) values
  ('90000000-0000-0000-0000-000000000001', 'editor@example.invalid'),
  ('90000000-0000-0000-0000-000000000002', 'admin@example.invalid'),
  ('90000000-0000-0000-0000-000000000003', 'super@example.invalid');

insert into public.admin_roles (user_id, role) values
  ('90000000-0000-0000-0000-000000000001', 'editor'),
  ('90000000-0000-0000-0000-000000000002', 'admin'),
  ('90000000-0000-0000-0000-000000000003', 'super_admin');

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);

select results_eq(
  $$ select count(*)::bigint from public.categories where is_active $$,
  $$ values (5::bigint) $$,
  'anónimo lê categorias ativas'
);

select results_eq(
  $$ select count(*)::bigint from public.businesses where status = 'published' $$,
  $$ values (5::bigint) $$,
  'anónimo lê empresas publicadas'
);

select is_empty(
  $$ select id from public.businesses where slug = 'estudio-mar-de-mentirinha' $$,
  'anónimo não lê rascunhos'
);

select throws_ok(
  $$ insert into public.categories (name, slug) values ('Bloqueada', 'bloqueada') $$,
  '42501',
  null,
  'escrita anónima é bloqueada'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"90000000-0000-0000-0000-000000000001"}',
  true
);

select lives_ok(
  $$ update public.categories set description = 'Edição autorizada' where slug = 'gastronomia' $$,
  'editor gere conteúdo editorial'
);

select results_eq(
  $$ with changed as (
       update public.admin_roles set role = 'admin'
       where user_id = '90000000-0000-0000-0000-000000000001'
       returning 1
     ) select count(*)::bigint from changed $$,
  $$ values (0::bigint) $$,
  'editor altera zero papéis'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"90000000-0000-0000-0000-000000000002"}',
  true
);

select lives_ok(
  $$ update public.ad_campaigns set priority = priority + 1
     where id = '40000000-0000-0000-0000-000000000001' $$,
  'admin gere campanhas'
);

select results_eq(
  $$ with changed as (
       update public.admin_roles set role = 'editor'
       where user_id = '90000000-0000-0000-0000-000000000001'
       returning 1
     ) select count(*)::bigint from changed $$,
  $$ values (0::bigint) $$,
  'admin altera zero papéis'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"90000000-0000-0000-0000-000000000003"}',
  true
);

select lives_ok(
  $$ update public.admin_roles set role = 'editor'
     where user_id = '90000000-0000-0000-0000-000000000001' $$,
  'super admin gere papéis'
);

reset role;

select lives_ok(
  $$ insert into public.ad_campaigns (
       id, business_id, placement_id, status, starts_at, ends_at, display_order, internal_path
     ) values
       ('40000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000004',
        (select id from public.ad_placements where code = 'HOME_HERO'),
        'active', now(), now() + interval '1 day', 6, '/empresas/oficina-farol-cenografico'),
       ('40000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000005',
        (select id from public.ad_placements where code = 'HOME_HERO'),
        'active', now(), now() + interval '1 day', 7, '/empresas/mercado-vila-imaginaria') $$,
  'capacidade aceita até cinco campanhas sobrepostas'
);

select throws_ok(
  $$ insert into public.ad_campaigns (
       id, business_id, placement_id, status, starts_at, ends_at, display_order, internal_path
     ) values (
       '40000000-0000-0000-0000-000000000008',
       '20000000-0000-0000-0000-000000000001',
       (select id from public.ad_placements where code = 'HOME_HERO'),
       'active', now(), now() + interval '1 day', 8, '/empresas/bistro-horizonte-teste'
     ) $$,
  '23514',
  'ad placement capacity exceeded',
  'sexta campanha sobreposta é bloqueada'
);

select throws_ok(
  $$ insert into public.ad_campaigns (
       business_id, placement_id, status, starts_at, ends_at, internal_path
     ) values (
       '20000000-0000-0000-0000-000000000001',
       (select id from public.ad_placements where code = 'HOME_HERO'),
       'active', now(), now() - interval '1 day', '/empresas/bistro-horizonte-teste'
     ) $$,
  '22000',
  null,
  'período inválido é bloqueado'
);

select * from finish();
rollback;
