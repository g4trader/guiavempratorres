# ADR 0003 — Estratégia inicial de mapas

Status: aceito, 2026-07-27.

## Decisão

Na primeira fase, a página da empresa constrói um link HTTPS para o
OpenStreetMap a partir de latitude e longitude validadas no banco. Não há mapa
incorporado, SDK de terceiros ou chave enviada ao navegador.

## Motivo

O link reduz JavaScript, custo, superfície de privacidade e gestão de
credenciais. Empresas sem o par completo de coordenadas não exibem o CTA. O
endereço textual continua disponível.

## Evolução

Um mapa incorporado só será introduzido após requisitos de interação e
consentimento. Qualquer provedor com chave deve usar restrição de origem e,
quando aplicável, proxy server-side; chaves privadas nunca recebem prefixo
`NEXT_PUBLIC_`.
