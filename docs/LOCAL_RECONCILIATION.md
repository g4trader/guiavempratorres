# Reconciliação da cópia local

Inventário em 23/10/2026. A cópia original está em `feature/cloud-supabase-foundation`; a base publicada é `a0016d3`. As correções desta entrega foram feitas em checkout isolado, branch `fix/technical-handoff`, para não sobrescrever trabalho local.

O inventário compara o conteúdo efetivo dos arquivos modificados/não rastreados com a versão publicada. Igualdade permite reconhecer trabalho já incorporado. Diferença não significa que o arquivo local deve substituir a main: ele pode misturar alterações próprias com código antigo. Nada foi descartado, resetado ou sobreposto. `reativarinfra.md` e configurações locais não são copiados para evitar transportar dados operacionais desnecessários.

| Arquivo local                                                                  | Comparação                                            |
| ------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `README.md`                                                                    | Diferente da versão publicada; preservar para revisão |
| `app/admin/actions.ts`                                                         | Igual à versão publicada                              |
| `app/admin/campanhas/page.tsx`                                                 | Diferente da versão publicada; preservar para revisão |
| `app/admin/categorias/page.tsx`                                                | Igual à versão publicada                              |
| `app/admin/content-actions.ts`                                                 | Diferente da versão publicada; preservar para revisão |
| `app/admin/empresas/page.tsx`                                                  | Diferente da versão publicada; preservar para revisão |
| `app/categorias/[slug]/page.tsx`                                               | Igual à versão publicada                              |
| `app/empresas/[slug]/page.tsx`                                                 | Diferente da versão publicada; preservar para revisão |
| `app/globals.css`                                                              | Diferente da versão publicada; preservar para revisão |
| `app/page.tsx`                                                                 | Diferente da versão publicada; preservar para revisão |
| `components/admin/CampaignAudienceFields.tsx`                                  | Diferente da versão publicada; preservar para revisão |
| `components/admin/ImageUpload.tsx`                                             | Igual à versão publicada                              |
| `components/admin/PlanForm.tsx`                                                | Igual à versão publicada                              |
| `components/public/BusinessCard.tsx`                                           | Diferente da versão publicada; preservar para revisão |
| `docs/IMAGE_SPECIFICATIONS.md`                                                 | Diferente da versão publicada; preservar para revisão |
| `lib/data/directory.ts`                                                        | Diferente da versão publicada; preservar para revisão |
| `lib/database.types.ts`                                                        | Diferente da versão publicada; preservar para revisão |
| `lib/domain.ts`                                                                | Diferente da versão publicada; preservar para revisão |
| `playwright.config.ts`                                                         | Igual à versão publicada                              |
| `tests/e2e/admin-crud.spec.ts`                                                 | Diferente da versão publicada; preservar para revisão |
| `tests/e2e/admin-existing-businesses.spec.ts`                                  | Igual à versão publicada                              |
| `tests/e2e/public.spec.ts`                                                     | Diferente da versão publicada; preservar para revisão |
| `app/api/admin/google-maps-location/route.ts`                                  | Igual à versão publicada                              |
| `app/demonstracao/imagens/page.tsx`                                            | Igual à versão publicada                              |
| `components/admin/BusinessCommercialFields.tsx`                                | Igual à versão publicada                              |
| `components/admin/BusinessLocationFields.tsx`                                  | Diferente da versão publicada; preservar para revisão |
| `components/admin/CampaignPeriodFields.tsx`                                    | Igual à versão publicada                              |
| `components/admin/ImageUploadDemo.tsx`                                         | Igual à versão publicada                              |
| `docs/HANDOFF_TECNICO.md`                                                      | Diferente da versão publicada; preservar para revisão |
| `lib/admin/action-errors.ts`                                                   | Diferente da versão publicada; preservar para revisão |
| `lib/admin/commercial-validation.ts`                                           | Igual à versão publicada                              |
| `lib/data/media.ts`                                                            | Igual à versão publicada                              |
| `lib/google-maps.ts`                                                           | Diferente da versão publicada; preservar para revisão |
| `lib/media/image-layout.ts`                                                    | Igual à versão publicada                              |
| `supabase/migrations/20260730180000_business_google_maps_url.sql`              | Igual à versão publicada                              |
| `supabase/migrations/20260731210000_tourist_attractions_campaign_audience.sql` | Igual à versão publicada                              |
| `tests/e2e/image-editor.spec.ts`                                               | Diferente da versão publicada; preservar para revisão |
| `tests/unit/action-errors.test.ts`                                             | Diferente da versão publicada; preservar para revisão |
| `tests/unit/commercial-validation.test.ts`                                     | Igual à versão publicada                              |
| `tests/unit/google-maps.test.ts`                                               | Diferente da versão publicada; preservar para revisão |
| `tests/unit/image-layout.test.ts`                                              | Igual à versão publicada                              |

Antes de arquivar a pasta antiga, revisar os arquivos divergentes com o responsável. A entrega de código usa a branch de correções baseada na versão publicada.
