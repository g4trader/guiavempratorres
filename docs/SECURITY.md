# Segurança

Responsável operacional: `contato@vempratorres.com.br`.

## Identidade e acesso

Supabase Auth identifica usuários; `admin_roles` define `editor`, `admin` e `super_admin`. `requireAdmin()` consulta o usuário autenticado e o papel. Cadastro público não concede papel administrativo. Editor gere conteúdo e planos/itens conforme políticas atuais; admin também gere campanhas; somente super admin gere papéis.

RLS e constraints devem proteger todas as tabelas públicas. Novas tabelas exigem testes de leitura e escrita. Clientes públicos usam chave publicável; segredo service role não é necessário para os fluxos atuais e nunca deve chegar ao navegador.

## Arquivos

Buckets editoriais são públicos para leitura. Upload requer sessão e papel autorizado, limites, MIME declarado e caminho esperado. O editor decodifica imagens no navegador. Isso não equivale a inspeção binária no servidor nem sanitização completa de SVG. Não armazenar dados confidenciais nos buckets públicos.

Exclusão no cadastro remove referência; arquivos persistidos são retidos até coleta revisada. O descarte de arquivo de lote ainda não persistido é um fluxo separado. Limpeza por idade, sem verificar referências, não é segura.

## Operações

Nunca versionar `.env*` reais, `.vercel`, tokens, senhas, service-role keys ou JSON de conta de serviço. O `.env.example` contém apenas nomes e valores públicos de referência.

Executar `pnpm db:check` antes de comandos remotos Supabase. Não usar reset, exclusão de projetos, migration repair ou SQL destrutivo sem revisão e autorização explícita. Publicação em produção também exige autorização.

Testes de escrita recusam o projeto Supabase de produção e exigem destino e opt-in explícitos. Uma URL Preview pode apontar ao banco de produção; o nome do ambiente não basta.

## Validação

Lint reforça a fronteira de dados. Testes unitários cobrem a proteção de destinos e regressões de salvamento. A suíte SQL usa fixtures próprias e rollback, mas requer execução em cloud autorizado; não confundir a presença do teste com sua aprovação remota.

Pendências operacionais e limitações: [passagem técnica](HANDOFF_TECNICO.md).
