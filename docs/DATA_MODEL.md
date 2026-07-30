# Modelo de dados

O schema inicial cobre perfis/papéis, categorias, empresas, relações de
categoria, horários, mídia, produtos/serviços, posições, campanhas, criativos e
auditoria. Contatos vivem em `businesses`; não há tabela paralela redundante.

A posição `HOME_HERO` aceita cinco campanhas simultâneas. Um trigger usa lock
transacional por posição, bloqueio da linha da posição e intervalos
`tstzrange` para rejeitar sobreposição acima da capacidade. Veja o ADR 0002.

## Integridade

- UUIDs e foreign keys com regras de exclusão explícitas;
- slugs únicos e canônicos;
- enums para papéis, status, tipo de item, status de campanha e mídia;
- coordenadas em pares e dentro dos limites geográficos;
- publicação exige `published_at`;
- imagens editoriais exigem alt text;
- CTA exige label e URL em conjunto;
- preços opcionais e não negativos;
- períodos de campanha têm fim posterior ao início;
- criativo é único por campanha;
- `updated_at` é mantido por trigger;
- mudanças editoriais principais geram `audit_logs`.

## Seed

O seed contém cinco categorias, seis empresas totalmente fictícias (cinco
publicadas e um rascunho), dois itens por empresa publicada, três campanhas
vigentes, uma futura e uma expirada. Criativos usam SVGs locais em
`public/placeholders`.
