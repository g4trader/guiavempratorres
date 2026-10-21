# Cadastro de imagens

## Fluxo

Envie o arquivo original, confira a prévia e clique em **Aplicar imagem**. Depois,
salve o formulário. Não é necessário preparar arquivos nas proporções finais.

- Fotos usam uma moldura **4:3**, compartilhada por categorias, cards, capa da
  empresa, galeria, itens e arquivo de campanha. As molduras responsivas dos
  banners publicados são mantidas; as artes são exibidas inteiras, podendo haver
  espaço livre nas bordas.
- **Preencher com recorte** oferece zoom e posição horizontal/vertical. É o padrão
  das fotos de empresa, categorias e galeria.
- **Mostrar imagem inteira** preserva todo o conteúdo, com espaço livre quando
  necessário. É o padrão de campanhas e itens, que podem conter texto ou produtos.
- Logos mantêm o arquivo e a proporção originais, em uma área de apresentação 3:2.
  Não há recorte, conversão ou remoção de transparência.
- A imagem principal da campanha também aparece no celular. Uma imagem mobile
  diferente é opcional, em uma seção recolhida do formulário.
- O editor informa baixa resolução, inclusive ao aumentar o zoom. A exportação
  não amplia a imagem original e produz até 1600 × 1200 px em WebP (ou o formato
  retornado pelo navegador quando WebP não é suportado).
- A prévia e a exportação usam a mesma geometria. O texto alternativo continua
  sendo preenchido no formulário.

## Tamanhos recomendados em pixels

Estas recomendações aparecem em cada campo de upload, inclusive após selecionar
ou aplicar a imagem. As dimensões indicam **largura × altura**; não são exigências
para o arquivo de entrada.

| Tipo de imagem | Tamanho recomendado | Proporção |
| --- | --- | --- |
| Categoria | 1200 × 900 px | 4:3 |
| Foto principal da empresa (capa e card) | 1600 × 1200 px | 4:3 |
| Galeria da empresa | 1600 × 1200 px | 4:3 |
| Produto, serviço ou item | 1200 × 900 px | 4:3 |
| Banner/hero da campanha, principal e mobile opcional | 1600 × 1200 px | 4:3 |
| Logo em PNG, WebP, JPG ou AVIF | 1200 px no lado maior | Original, sem deformação |
| Logo em SVG | Sem tamanho obrigatório em pixels | Original |

Use um original maior quando precisar aproximar bastante o enquadramento. Não
amplie manualmente um arquivo pequeno apenas para atingir a recomendação.

## Formatos e limites

Fotos e campanhas aceitam JPG, PNG, WebP e AVIF até 25 MB de entrada, com limite de
60 megapixels. Após o ajuste, continuam valendo os limites de Storage: 5 MB para
categorias/itens e 8 MB para capa/galeria/campanhas. Logos aceitam também SVG, até
2 MB, sem conversão. Use SVG com dimensões intrínsecas e fontes/recursos embutidos.

Para artes promocionais, prefira título, descrição e preço nos campos do cadastro.
Ao usar texto dentro da imagem, selecione **Mostrar imagem inteira** e confira a
legibilidade no celular. Fotos verticais são aceitas; escolha o enquadramento ou
mantenha a imagem inteira.

## Galeria e pontos turísticos

O envio em lote e a ordenação da galeria continuam disponíveis. Para recortar uma
foto, use **Ajustar uma foto antes de adicionar à galeria**. Os lotes mantêm seus
arquivos originais. Os campos de imagem de pontos turísticos usam o mesmo editor
e recomendam 1600 × 1200 px, preservando a integração com os blocos de conteúdo.

## Salvamento e compatibilidade

Aplicar envia a versão preparada para um caminho novo. O formulário só pode ser
submetido depois que o ajuste for aplicado ou cancelado e o envio terminar.
Falhas mantêm o ajuste para nova tentativa. Remover altera apenas o campo local;
a referência publicada muda quando o formulário for salvo. Arquivos existentes
não são apagados pelo componente, evitando quebrar referências ao cancelar.

O original selecionado fica disponível para **Ajustar novamente** durante esta
edição. Nesta primeira entrega, o original não é persistido separadamente no
Storage: após sair da página, é necessário selecioná-lo novamente para reenquadrar.
Arquivos enviados em edições abandonadas e arquivos substituídos permanecem no
Storage; coleta de arquivos sem referências exige uma rotina separada e não faz
parte desta entrega. Imagens antigas não são regravadas e continuam sendo exibidas
inteiras. Não há migration ou mudança de configuração de ambiente.

## Demonstração e validação

Execute `pnpm dev` com Node 22 e abra `/demonstracao/imagens`. A página só existe em
modo de desenvolvimento e informa explicitamente **Modo demonstrativo**. Usa o
mesmo componente do cadastro, mas não autentica, envia arquivos ou grava registros.
Experimente um arquivo próprio ou o exemplo ilustrativo incluído.

A demonstração permite testar foto, campanha e logo, ajustar, cancelar e simular o
salvamento. Os resultados usam os componentes de mídia do frontend.

Validações: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` e, com o servidor
de desenvolvimento disponível, `E2E_BASE_URL=http://127.0.0.1:3000 pnpm exec playwright test tests/e2e/image-editor.spec.ts`.
Os testes administrativos existentes incluem a confirmação **Aplicar imagem**;
executá-los contra uma nuvem requer ambiente de testes e credenciais autorizadas.
