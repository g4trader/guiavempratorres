# Guia Vem Pra Torres

Guia local de empresas, profissionais, produtos e serviços de Torres e região.

## Stack

Next.js 16, React 19, TypeScript estrito, Supabase (PostgreSQL/Auth/Storage), Vitest, Playwright e Vercel. Node 22 e pnpm 10 são obrigatórios.

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

Serviços persistentes são exclusivamente cloud. Não use Docker, `supabase start`
ou PostgreSQL local. O projeto usa um único Supabase Cloud chamado
`guiavempratorres`.

Antes de qualquer operação remota:

```bash
SUPABASE_PROJECT_REF=<ref-autorizado> \
SUPABASE_PROJECT_NAME=guiavempratorres \
SUPABASE_ORGANIZATION_ID=ljfsuuapozqveecvqwxy \
pnpm db:check
```

Com o projeto explicitamente confirmado:

```bash
pnpm db:lint
pnpm db:push
pnpm db:types
```

Variáveis de Preview são configuradas diretamente na Vercel, somente no target
Preview. `.env.local` pode ser usado temporariamente para o Next.js, mas nunca é
versionado. Sem configuração Supabase Cloud, a aplicação entra em modo
demonstrativo explicitamente identificado.

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
- `lib/data`: única camada de queries server-side;
- `lib/database.types.ts`: tipos gerados/alinhados ao schema local;
- `lib`: regras de domínio, autorização e fallback demonstrativo;
- `supabase`: configuração, migrations, testes e seed;
- `tests`: testes unitários e E2E;
- `docs`: arquitetura, design, segurança e operações.

## Ambientes

Edição, lint, typecheck, testes unitários e build rodam localmente. Banco, Auth e
Storage usam um único Supabase Cloud; durante o desenvolvimento entram apenas
dados fictícios e o deploy funcional usa Vercel Preview protegido.

## Limitações conhecidas

O Supabase único ainda não está conectado. O CRUD/admin completo e uploads serão
implementados após autenticação segura. Logo e favicon oficiais já foram
fornecidos; mídia editorial autorizada ainda está pendente.

## Marca

Ativos institucionais oficiais vivem exclusivamente em `public/brand/` e são
renderizados pelo componente `components/layout/Logo.tsx`.
