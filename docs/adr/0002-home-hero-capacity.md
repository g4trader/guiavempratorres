# ADR 0002 — Capacidade concorrente do hero

Status: aceito, 2026-07-27.

## Contexto

`HOME_HERO` aceita no máximo cinco campanhas ativas em qualquer instante. Uma
verificação feita apenas pela aplicação sofreria condição de corrida entre
requisições simultâneas.

## Decisão

Um trigger `before insert or update` chama
`enforce_ad_placement_capacity()`. A função:

1. ignora campanhas que não estão no estado `active`;
2. adquire `pg_advisory_xact_lock` derivado do UUID da posição;
3. bloqueia a linha de `ad_placements` com `for update`;
4. rejeita posições inativas;
5. conta intervalos ativos sobrepostos usando `tstzrange(..., '[)')`;
6. rejeita a transação com SQLSTATE `23514` quando a capacidade seria excedida.

O limite vem de `maximum_active_ads`; `HOME_HERO` é criado com cinco. O intervalo
semiaberto permite que uma campanha comece exatamente quando outra termina.

## Consequências

A regra é atômica mesmo sob concorrência. Alterações de capacidade também
serializam com inclusão de campanhas. A aplicação ainda limita a consulta a
cinco como defesa adicional, mas não é a fronteira de integridade.
