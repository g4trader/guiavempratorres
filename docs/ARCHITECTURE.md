# Arquitetura

A aplicação usa Next.js App Router e TypeScript estrito. As páginas públicas são renderizadas no servidor e só recebem JavaScript de cliente quando uma interação o exigir. A camada `lib` concentra regras de domínio; o banco Supabase concentra integridade, RLS e a capacidade transacional de anúncios.

## Ambientes

- local: Supabase CLI + Docker e Next.js;
- preview/staging: Vercel Preview e um projeto Supabase separado (ainda não fornecido);
- produção: Vercel + projeto Supabase `ggdynlmtvkvrpeyozsxn`, sem alterações nesta inicialização.

Enquanto staging não existir, nenhuma migration será aplicada ao projeto informado.

O projeto GCP aprovado é `guiavempratorres` (`924082117536`) e a região
aprovada para cargas futuras é `southamerica-east1`. Nenhuma carga ou API GCP
está provisionada.
