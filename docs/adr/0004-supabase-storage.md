# ADR 0004 — Supabase Storage editorial

Status: aceito para o projeto cloud único, 2026-07-27.

## Decisão

Usar Supabase Storage para imagens editoriais nos buckets:

- `category-images`;
- `business-logos`;
- `business-hero-images`;
- `business-gallery`;
- `product-service-images`;
- `ad-creatives`.

Leitura é pública. Escrita exige usuário autenticado com papel adequado no
banco. Editores não gerem criativos publicitários; admins e super admins gerem.

## Restrições

Cada bucket declara MIME permitido e limite de tamanho. Objetos usam o padrão:

```text
<entity-uuid>/<media-uuid>/<random-uuid>.<extensão>
```

A migration valida o formato do caminho. A aplicação server-side ainda deve
validar assinatura real do arquivo, dimensões, tamanho, extensão e autorização
antes de emitir a operação de upload. Substituição deve criar o novo objeto,
atualizar o registro numa transação lógica e remover o antigo somente após
sucesso. Service role nunca é usada no navegador.

## Estado de aplicação

Essa configuração está versionada e será aplicada no Supabase Cloud
`guiavempratorres` após a proteção de project ref. Durante o desenvolvimento,
somente mídia fictícia ou oficialmente fornecida pode ser enviada.
