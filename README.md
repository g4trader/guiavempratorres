# Guia Vem Pra Torres

Guia local de empresas, profissionais, produtos e serviços de Torres e região.

## Stack

Next.js 16, React 19, TypeScript estrito, Supabase (PostgreSQL/Auth/Storage), Vitest, Playwright e Vercel. Node 22 e pnpm 10 são obrigatórios.

## Desenvolvimento

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Para banco local, Docker deve estar ativo:

```bash
pnpm supabase:start
pnpm supabase:reset
pnpm test:db
```

## Qualidade

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm format:check
```

## Estrutura

- `app`: rotas públicas, administrativas e SEO;
- `lib`: regras de domínio e fonte temporária fictícia;
- `supabase`: configuração, migrations, testes e seed;
- `tests`: testes unitários e E2E;
- `docs`: arquitetura, design, segurança e operações.

## Ambientes

Local está disponível após instalação. Preview/staging ainda não está vinculado. O projeto Supabase informado pelo cliente é tratado como produção até confirmação em contrário e não recebeu migrations.

## Limitações conhecidas

O conteúdo público ainda usa fixtures para permitir build sem credenciais. O CRUD/admin, uploads e carrossel visual completo serão conectados após autenticação segura e disponibilização de staging. O logotipo oficial e mídia autorizada ainda não foram fornecidos.
