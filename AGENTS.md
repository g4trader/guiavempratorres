# AGENTS.md

## Comandos obrigatórios

Use Node 22 e pnpm. Antes de commit: `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build`. Rode E2E quando a aplicação estiver disponível.

## Arquitetura e convenções

Next.js App Router, Server Components por padrão, TypeScript estrito e tokens em `app/globals.css`. Regras de domínio ficam em `lib`; integridade e autorização ficam também no banco.

Queries Supabase ficam exclusivamente em `lib/data`. Gere novamente
`lib/database.types.ts` após alterar migrations e confirmar o projeto:

```bash
pnpm db:types
```

Não use Docker, Supabase local, PostgreSQL local ou emuladores. Preview sem
Supabase deve se identificar como modo demonstrativo.

## Áreas sensíveis

- Nunca versionar `.env*`, `.vercel`, tokens, senhas, service-role keys ou JSON de conta de serviço.
- Toda alteração de schema exige migration em `supabase/migrations`.
- Toda tabela pública exige RLS e teste de leitura/escrita.
- Não alterar ou resetar banco remoto sem confirmar projeto e ambiente.
- Antes de qualquer comando Supabase remoto, execute `pnpm db:check`.
- Não execute reset, delete de projeto/branch, migration repair ou SQL destrutivo
  sem revisão e autorização explícita.
- Não publicar em produção sem autorização explícita.
- Preview manual exige `vercel deploy --target=preview`.
- Não criar recursos GCP sem ADR e finalidade aprovada.
- Logo e favicon oficiais vivem somente em `public/brand/`; páginas usam o
  componente `Logo`, nunca importam o PNG diretamente.

## Critério de conclusão

Código, testes e documentação devem estar alinhados; lint, typecheck, testes e build precisam passar. Atualize documentação e `.env.example` ao mudar configuração.
