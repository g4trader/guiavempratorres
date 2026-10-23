# Segurança

- Supabase RLS está ativo em todas as tabelas expostas.
- Anônimos só leem categorias ativas, empresas publicadas e conteúdo vigente.
- Escrita exige papéis administrativos; somente `super_admin` gere papéis.
- Não há autocadastro administrativo.
- A service-role key é exclusiva do servidor e nunca recebe prefixo `NEXT_PUBLIC_`.
- Migrations remotas exigem revisão, confirmação explícita e `pnpm db:check`.
- Uploads futuros devem validar MIME real, tamanho, dimensão, caminho aleatório e alt text.
- A aplicação não embute chave privada de mapas; o MVP cria link para OpenStreetMap.
- Editores gerem conteúdo, mas não campanhas nem papéis.
- Admins gerem conteúdo e campanhas, mas não papéis.
- Somente super admins gerem papéis.
- Storage valida bucket, papel, caminho, MIME declarado e tamanho; validação
  server-side de conteúdo real continua obrigatória.
- Queries públicas usam a publishable/anon key e dependem de RLS; service role
  não participa das páginas públicas.
- Banco, Auth e Storage não usam Docker ou emuladores. Testes de integração
  apontam para o único projeto cloud e limpam exclusivamente os próprios dados.
- Durante o desenvolvimento, variáveis Supabase são configuradas primeiro no
  Vercel Preview. Service role nunca é enviada ao cliente.

O CRUD de upload ainda não existe. Remoção segura de arquivo antigo deverá ser
implementada junto ao fluxo server-side, conforme ADR 0004.
