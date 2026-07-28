-- Dados exclusivamente fictícios para desenvolvimento local.
insert into public.categories (id, name, slug, description, display_order) values
('10000000-0000-0000-0000-000000000001', 'Gastronomia', 'gastronomia', 'Sabores locais.', 1),
('10000000-0000-0000-0000-000000000002', 'Hospedagem', 'hospedagem', 'Onde ficar.', 2),
('10000000-0000-0000-0000-000000000003', 'Passeios', 'passeios', 'Experiências na região.', 3),
('10000000-0000-0000-0000-000000000004', 'Serviços', 'servicos', 'Profissionais locais.', 4),
('10000000-0000-0000-0000-000000000005', 'Compras', 'compras', 'Comércio local.', 5);

insert into public.businesses (id, name, slug, short_description, description, status, published_at) values
('20000000-0000-0000-0000-000000000001', 'Sabores da Praia', 'sabores-da-praia', 'Restaurante fictício.', 'Uso exclusivo em desenvolvimento.', 'published', now()),
('20000000-0000-0000-0000-000000000002', 'Pousada Vento Sul', 'pousada-vento-sul', 'Pousada fictícia.', 'Uso exclusivo em desenvolvimento.', 'published', now()),
('20000000-0000-0000-0000-000000000003', 'Rota dos Canyons', 'rota-dos-canyons', 'Passeios fictícios.', 'Uso exclusivo em desenvolvimento.', 'published', now()),
('20000000-0000-0000-0000-000000000004', 'Oficina Farol', 'oficina-farol', 'Serviço fictício.', 'Uso exclusivo em desenvolvimento.', 'published', now()),
('20000000-0000-0000-0000-000000000005', 'Mercado da Vila', 'mercado-da-vila', 'Comércio fictício.', 'Uso exclusivo em desenvolvimento.', 'published', now()),
('20000000-0000-0000-0000-000000000006', 'Estúdio Mar Azul', 'estudio-mar-azul', 'Serviço fictício.', 'Uso exclusivo em desenvolvimento.', 'draft', null);
