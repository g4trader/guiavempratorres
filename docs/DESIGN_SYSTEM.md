# Design system

Os tokens vivem em `app/globals.css`. A linguagem usa Fredoka em títulos, Nunito Sans no corpo, verde `#2d9d78` como ação, azul-petróleo `#123146` como texto e `#eef6fb` como fundo. O container máximo é 1200 px, cards usam raio de 16 px e destaques 24 px.

Estados de foco são sempre visíveis. Touch targets têm pelo menos 44 px. A interface respeita `prefers-reduced-motion`; layouts quebram em 800 px e 520 px, com validação alvo entre 320 e 1440 px.

## Ativos institucionais

`public/brand/` é a única fonte de verdade da marca:

- logo: `public/brand/logo_vempratorres.png`;
- favicon: `public/brand/favicon.svg`.

O logo só pode ser renderizado pelo componente
`components/layout/Logo.tsx`. Ele preserva a proporção 2:1, usa dimensões
intrínsecas 240×120, alt “Vem Pra Torres” e prepara variantes `default`,
`light` e `dark`, todas apontando inicialmente para o mesmo arquivo oficial.
Não alterar cores, tipografia, sombras, contornos ou proporção.

Organização permanente:

- `public/brand/`: ativos institucionais oficiais;
- `public/images/`: imagens editoriais locais autorizadas;
- `public/placeholders/`: placeholders explicitamente não institucionais;
- `public/icons/`: ícones próprios;
- `public/og/`: futuros ativos Open Graph oficiais.

Novos nomes usam letras minúsculas, palavras separadas por hífen e extensão
original, exceto arquivos oficiais já nomeados pelo cliente. Não duplicar logo
ou favicon fora de `public/brand/`. Apple Touch Icon e Open Graph usam
placeholders neutros até o cliente fornecer ativos oficiais; não gerar versões
artificiais da marca.
