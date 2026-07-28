-- Dados exclusivamente fictícios para desenvolvimento local.
insert into public.categories (id, name, slug, description, image_path, image_alt, display_order) values
  ('10000000-0000-0000-0000-000000000001', 'Gastronomia', 'gastronomia', 'Sabores fictícios para desenvolvimento.', 'category-images/10000000-0000-0000-0000-000000000001/00000000-0000-0000-0000-000000000001/00000000-0000-0000-0000-000000000001.webp', 'Mesa de restaurante fictício', 1),
  ('10000000-0000-0000-0000-000000000002', 'Hospedagem', 'hospedagem', 'Hospedagens fictícias para desenvolvimento.', 'category-images/10000000-0000-0000-0000-000000000002/00000000-0000-0000-0000-000000000002/00000000-0000-0000-0000-000000000002.webp', 'Quarto fictício iluminado', 2),
  ('10000000-0000-0000-0000-000000000003', 'Serviços', 'servicos', 'Prestadores fictícios para desenvolvimento.', 'category-images/10000000-0000-0000-0000-000000000003/00000000-0000-0000-0000-000000000003/00000000-0000-0000-0000-000000000003.webp', 'Profissionais fictícios reunidos', 3),
  ('10000000-0000-0000-0000-000000000004', 'Comércio', 'comercio', 'Lojas fictícias para desenvolvimento.', 'category-images/10000000-0000-0000-0000-000000000004/00000000-0000-0000-0000-000000000004/00000000-0000-0000-0000-000000000004.webp', 'Loja fictícia', 4),
  ('10000000-0000-0000-0000-000000000005', 'Turismo e lazer', 'turismo-e-lazer', 'Experiências fictícias para desenvolvimento.', 'category-images/10000000-0000-0000-0000-000000000005/00000000-0000-0000-0000-000000000005/00000000-0000-0000-0000-000000000005.webp', 'Paisagem fictícia ao entardecer', 5);

insert into public.businesses (
  id, name, slug, short_description, description, status, address_line, neighborhood,
  phone, whatsapp, email, latitude, longitude, hero_image_path, hero_image_alt, published_at, plan_id
) values
  ('20000000-0000-0000-0000-000000000001', 'Bistrô Horizonte Teste', 'bistro-horizonte-teste', 'Cozinha fictícia de desenvolvimento.', 'Empresa completamente fictícia criada para testes locais.', 'published', 'Rua Fictícia 101', 'Centro de Testes', '(51) 3000-0001', '555130000001', 'bistro@example.invalid', -29.335001, -49.727001, 'business-hero-images/20000000-0000-0000-0000-000000000001/00000000-0000-0000-0000-000000000011/00000000-0000-0000-0000-000000000011.webp', 'Salão fictício do Bistrô Horizonte Teste', now() - interval '30 days', '50000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000002', 'Pousada Brisa Modelo', 'pousada-brisa-modelo', 'Hospedagem fictícia de desenvolvimento.', 'Empresa completamente fictícia criada para testes locais.', 'published', 'Avenida Exemplo 202', 'Praia Modelo', '(51) 3000-0002', '555130000002', 'pousada@example.invalid', -29.342002, -49.724002, 'business-hero-images/20000000-0000-0000-0000-000000000002/00000000-0000-0000-0000-000000000012/00000000-0000-0000-0000-000000000012.webp', 'Quarto fictício da Pousada Brisa Modelo', now() - interval '20 days', '50000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000003', 'Rota Inventada Aventuras', 'rota-inventada-aventuras', 'Passeios fictícios de desenvolvimento.', 'Empresa completamente fictícia criada para testes locais.', 'published', 'Travessa Simulada 303', 'Centro de Testes', '(51) 3000-0003', '555130000003', 'rota@example.invalid', -29.340003, -49.730003, 'business-hero-images/20000000-0000-0000-0000-000000000003/00000000-0000-0000-0000-000000000013/00000000-0000-0000-0000-000000000013.webp', 'Trilha fictícia da Rota Inventada Aventuras', now() - interval '15 days', '50000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000004', 'Oficina Farol Cenográfico', 'oficina-farol-cenografico', 'Serviços fictícios de manutenção.', 'Empresa completamente fictícia criada para testes locais.', 'published', 'Rua Hipotética 404', 'Bairro Laboratório', '(51) 3000-0004', '555130000004', 'oficina@example.invalid', -29.344004, -49.734004, 'business-hero-images/20000000-0000-0000-0000-000000000004/00000000-0000-0000-0000-000000000014/00000000-0000-0000-0000-000000000014.webp', 'Oficina fictícia Farol Cenográfico', now() - interval '10 days', '50000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000005', 'Mercado Vila Imaginária', 'mercado-vila-imaginaria', 'Comércio fictício de desenvolvimento.', 'Empresa completamente fictícia criada para testes locais.', 'published', 'Alameda Demonstração 505', 'Vila Imaginária', '(51) 3000-0005', '555130000005', 'mercado@example.invalid', -29.346005, -49.736005, 'business-hero-images/20000000-0000-0000-0000-000000000005/00000000-0000-0000-0000-000000000015/00000000-0000-0000-0000-000000000015.webp', 'Fachada fictícia do Mercado Vila Imaginária', now() - interval '5 days', '50000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000006', 'Estúdio Mar de Mentirinha', 'estudio-mar-de-mentirinha', 'Rascunho fictício não publicado.', 'Empresa completamente fictícia que prova o bloqueio de rascunhos.', 'draft', 'Rua Não Publicada 606', 'Bairro Rascunho', null, null, 'draft@example.invalid', -29.348006, -49.738006, null, null, null, '50000000-0000-0000-0000-000000000001');

insert into public.business_categories (business_id, category_id, is_primary) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', true),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', true),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000005', true),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', true),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000004', true),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', true);

insert into public.business_hours (business_id, day_of_week, opens_at, closes_at)
select business_id, day, '09:00'::time, '18:00'::time
from (
  values
    ('20000000-0000-0000-0000-000000000001'::uuid),
    ('20000000-0000-0000-0000-000000000002'::uuid),
    ('20000000-0000-0000-0000-000000000003'::uuid),
    ('20000000-0000-0000-0000-000000000004'::uuid),
    ('20000000-0000-0000-0000-000000000005'::uuid)
) businesses(business_id)
cross join generate_series(1, 5) day;

insert into public.business_items (
  id, business_id, type, title, description, price, display_order
) values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'PRODUCT', 'Prato Modelo', 'Item fictício.', 49.90, 1),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'MENU', 'Menu Demonstração', 'Menu fictício sem preço.', null, 2),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'SERVICE', 'Diária Exemplo', 'Serviço fictício.', 299.00, 1),
  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', 'SERVICE', 'Café Modelo', 'Serviço fictício sem preço.', null, 2),
  ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000003', 'SERVICE', 'Roteiro Simulado', 'Serviço fictício.', 180.00, 1),
  ('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000003', 'CATALOG', 'Trilha Demonstração', 'Catálogo fictício sem preço.', null, 2),
  ('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000004', 'SERVICE', 'Revisão Cenográfica', 'Serviço fictício.', 120.00, 1),
  ('30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000004', 'PRODUCT', 'Kit de Teste', 'Produto fictício.', 39.90, 2),
  ('30000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000005', 'PROMOTION', 'Cesta Imaginária', 'Promoção fictícia.', 89.90, 1),
  ('30000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000005', 'SERVICE', 'Entrega de Mentirinha', 'Serviço fictício sem preço.', null, 2);

insert into public.ad_campaigns (
  id, business_id, placement_id, status, starts_at, ends_at, display_order, priority, internal_path
) values
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', (select id from public.ad_placements where code = 'HOME_HERO'), 'active', now() - interval '2 days', now() + interval '20 days', 1, 30, '/empresas/bistro-horizonte-teste'),
  ('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', (select id from public.ad_placements where code = 'HOME_HERO'), 'active', now() - interval '2 days', now() + interval '20 days', 2, 20, '/empresas/pousada-brisa-modelo'),
  ('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', (select id from public.ad_placements where code = 'HOME_HERO'), 'active', now() - interval '2 days', now() + interval '20 days', 3, 10, '/empresas/rota-inventada-aventuras'),
  ('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', (select id from public.ad_placements where code = 'HOME_HERO'), 'active', now() + interval '10 days', now() + interval '30 days', 4, 5, '/empresas/oficina-farol-cenografico'),
  ('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000005', (select id from public.ad_placements where code = 'HOME_HERO'), 'active', now() - interval '30 days', now() - interval '5 days', 5, 1, '/empresas/mercado-vila-imaginaria');

insert into public.ad_creatives (
  campaign_id, desktop_image_path, mobile_image_path, image_alt, title, description
) values
  ('40000000-0000-0000-0000-000000000001', '/placeholders/hero-desktop.svg', '/placeholders/hero-mobile.svg', 'Composição ilustrativa do Bistrô Horizonte Teste', 'Sabores inventados, experiência real de teste', 'Campanha fictícia para desenvolvimento local.'),
  ('40000000-0000-0000-0000-000000000002', '/placeholders/hero-desktop.svg', '/placeholders/hero-mobile.svg', 'Composição ilustrativa da Pousada Brisa Modelo', 'Uma estadia feita para demonstrar', 'Campanha fictícia para desenvolvimento local.'),
  ('40000000-0000-0000-0000-000000000003', '/placeholders/hero-desktop.svg', '/placeholders/hero-mobile.svg', 'Composição ilustrativa da Rota Inventada Aventuras', 'Explore um roteiro totalmente fictício', 'Campanha fictícia para desenvolvimento local.'),
  ('40000000-0000-0000-0000-000000000004', '/placeholders/hero-desktop.svg', '/placeholders/hero-mobile.svg', 'Composição ilustrativa da Oficina Farol Cenográfico', 'Uma campanha futura de teste', 'Campanha fictícia futura.'),
  ('40000000-0000-0000-0000-000000000005', '/placeholders/hero-desktop.svg', '/placeholders/hero-mobile.svg', 'Composição ilustrativa do Mercado Vila Imaginária', 'Uma campanha expirada de teste', 'Campanha fictícia expirada.');

-- Não referenciar objetos inexistentes no Storage. O site apresenta seu
-- placeholder neutro até que imagens sejam enviadas pelo painel.
update public.categories
set image_path = null, image_alt = null
where id between
  '10000000-0000-0000-0000-000000000001' and
  '10000000-0000-0000-0000-000000000005';

update public.businesses
set hero_image_path = null, hero_image_alt = null
where id between
  '20000000-0000-0000-0000-000000000001' and
  '20000000-0000-0000-0000-000000000006';
