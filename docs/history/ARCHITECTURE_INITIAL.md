# Arquitetura

A aplicação usa Next.js App Router e TypeScript estrito. As páginas públicas são renderizadas no servidor e só recebem JavaScript de cliente quando uma interação o exigir. A camada `lib` concentra regras de domínio; o banco Supabase concentra integridade, RLS e a capacidade transacional de anúncios.

`lib/data/directory.ts` é a fronteira única de leitura pública. Componentes não
executam queries. Quando as variáveis cloud existem, a camada consulta Supabase
sob RLS anônima; sem elas, retorna fixtures e a interface exibe modo
demonstrativo. Esse fallback jamais é apresentado como integração real.

O carrossel é o único Client Component público desta fase. Não possui autoplay,
mantém setas e indicadores acessíveis e troca apenas uma imagem por vez.

## Ambientes

- local: edição, Next.js, lint, typecheck, testes unitários e Git, sem serviços persistentes;
- desenvolvimento: Vercel Preview protegido + único Supabase Cloud
  `guiavempratorres`, inicialmente apenas com dados fictícios;
- produção: a mesma base Supabase, com dados reais somente após validação e
  autorização; Vercel Production permanece separada e intocada nesta fase.

Nenhuma migration remota é aplicada sem passar por
`scripts/assert-supabase-project.mjs`, que confirma ref, nome e organização e
bloqueia SQL destrutivo.

O projeto GCP aprovado é `guiavempratorres` (`924082117536`) e a região
aprovada para cargas futuras é `southamerica-east1`. Nenhuma carga ou API GCP
está provisionada.
