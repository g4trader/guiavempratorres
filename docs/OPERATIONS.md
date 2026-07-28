# Operações

## Regra de ambientes

Produção não é alterada nesta primeira execução. Toda migration nasce em `supabase/migrations`, é testada localmente e aplicada primeiro em staging.

## Acessos oficiais

Use login via navegador nas CLIs (`gh auth login`, `vercel login`, `supabase login`, `gcloud auth login`). Nunca cole senhas, tokens, service-role keys ou JSON de service account no chat ou no repositório.

## Rotina

1. `pnpm install --frozen-lockfile`
2. `pnpm supabase:start`
3. `pnpm supabase:reset`
4. `pnpm test:db`
5. `pnpm lint && pnpm typecheck && pnpm test && pnpm build`

Deploy de Preview só ocorre após projeto/equipe/variáveis terem sido auditados.

## Projetos confirmados

- Vercel: equipe `vem-pra-torres`, projeto `guiavempratorres`;
- Supabase produção: `ggdynlmtvkvrpeyozsxn`, East US (Ohio);
- GCP: `guiavempratorres`, região aprovada `southamerica-east1`.
