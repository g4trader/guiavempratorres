# Guia Vem Pra Torres

Guia comercial e turístico de Torres, com catálogo público, administração, campanhas, planos, avaliações e editor de imagens.

A [documentação de passagem](docs/HANDOFF_TECNICO.md) reúne arquitetura, configuração, acessos, publicação e estado das pendências. O responsável operacional é `contato@vempratorres.com.br`.

## Desenvolvimento

Use Node 22 e pnpm 10.14.0:

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Preencha as variáveis por canal seguro. Banco, Auth e Storage usam Supabase Cloud. Não use Docker, Supabase local, PostgreSQL local ou emuladores. Sem Supabase válido, consultas retornam vazio; isso não é uma integração funcional.

`/demonstracao/imagens` funciona apenas em desenvolvimento, é identificada como demonstração e não grava dados.

## Qualidade

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Execute o E2E sem gravações, com servidor gerenciado pelo próprio comando:

```bash
pnpm test:e2e:images
```

Testes administrativos exigem projeto cloud de testes separado, `E2E_ALLOW_WRITES=true` e `E2E_SUPABASE_PROJECT_REF` coerente com a URL. O projeto Supabase de produção é bloqueado por esses testes. Não interpretar testes ignorados por falta de credenciais como cobertura aprovada.

## Estrutura e operação

- `app/`: rotas e pontos de entrada das actions.
- `components/`: interface administrativa e pública.
- `lib/data/`: consultas, persistência e actions autenticadas.
- `lib/`: domínio, validação, autenticação e geometria de imagens.
- `supabase/`: migrations e testes SQL.
- `docs/`: documentação; `docs/history/` preserva registros antigos, não instruções atuais.

Leia [AGENTS.md](AGENTS.md) antes de alterar o projeto. Antes de qualquer comando remoto Supabase, execute `pnpm db:check`. Mudanças de schema exigem migration e regeneração de tipos após confirmar o projeto. Produção exige autorização explícita; Preview manual usa `vercel deploy --target=preview`.

Logo e favicon oficiais vivem em `public/brand/`; páginas usam `components/layout/Logo.tsx`.
