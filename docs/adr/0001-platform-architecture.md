# ADR 0001 — Arquitetura de plataforma

Status: aceito para a fundação, 2026-07-27.

## Decisão

Usar Next.js no Vercel para a aplicação e Supabase para PostgreSQL, Auth e Storage. O GCP `guiavempratorres` permanece validado como conta/plataforma futura, sem recursos novos nesta fase. A região aprovada para uma carga futura é `southamerica-east1`.

## Motivo

Vercel e Supabase cobrem renderização, previews, banco relacional, autorização e mídia editorial do MVP sem duplicação operacional. GCP passa a ser considerado quando existir uma carga isolada e mensurável, como processamento assíncrono de imagens, filas ou uma integração que não caiba adequadamente nas plataformas atuais.

## Consequências

Server Components são o padrão. RLS é uma fronteira de segurança obrigatória. Não haverá Cloud SQL, Cloud Run ou GCS apenas para “usar GCP”. Um novo uso de GCP exige ADR, região aprovada, orçamento e identidade de menor privilégio.
