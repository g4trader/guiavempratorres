# Arquitetura

Next.js App Router, React e TypeScript estrito. Server Components carregam páginas; componentes de cliente implementam interações. Supabase fornece PostgreSQL, Auth e Storage; Vercel executa a aplicação. Google Geocoding resolve endereços no servidor.

## Camada de dados

Consultas e operações de Storage ficam em `lib/data`. ESLint bloqueia chamadas `.from()` e `.rpc()` fora dessa camada em `app`, `components` e `lib` (exceto `Array.from` e `Buffer.from`).

- `directory.ts` e `tourist-attractions.ts`: leituras públicas sob RLS.
- `admin-queries.ts`: consultas tipadas com cliente recebido do chamador; o servidor deve autenticar antes de usá-las.
- `admin-actions.ts`, `content-actions.ts`, `tourism-actions.ts`, `rating-actions.ts`: Server Actions com validação, autorização, persistência, revalidação e redirect.
- `media.ts` e `reviews.ts`: operações de navegador, com sessão e RLS.

Arquivos `app/**/actions.ts` reexportam as actions para manter os imports existentes. A fronteira `use server` está nas implementações; não remover autenticação ao reutilizá-las. A camada de dados não usa service role para contornar RLS.

## Convenções

Domínio e validações ficam em `lib`; integridade e autorização também existem no banco. Tokens visuais vivem em `app/globals.css`. Marca oficial é renderizada por `Logo`.

A remoção da galeria exclui primeiro a referência do banco e retém o arquivo. Isso evita apagar um objeto quando a exclusão do registro falha. Limpeza de objetos depende de revisão de todas as referências.

Salvamentos compostos de empresa/categorias e campanha/criativo/relações ainda usam várias chamadas. Verificação de erros e validação antecipada reduzem falhas silenciosas, mas não substituem transações no banco. Essa mudança exige migration revisada, teste cloud e coordenação de publicação.

## Ambientes

Local executa código e testes; serviços persistentes são cloud. Preview Vercel não garante isolamento de dados. Testes autenticados de escrita bloqueiam o Supabase oficial de produção e exigem opt-in para projeto de testes separado. A aplicação Preview envia `X-Robots-Tag: noindex, nofollow` e robots com bloqueio global; proteção de acesso continua responsabilidade da configuração Vercel.

Detalhes: [passagem técnica](HANDOFF_TECNICO.md). Registros antigos estão em `history/`.
