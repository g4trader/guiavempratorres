# Segurança

- Supabase RLS está ativo em todas as tabelas expostas.
- Anônimos só leem categorias ativas, empresas publicadas e conteúdo vigente.
- Escrita exige papéis administrativos; somente `super_admin` gere papéis.
- Não há autocadastro administrativo.
- A service-role key é exclusiva do servidor e nunca recebe prefixo `NEXT_PUBLIC_`.
- Migrations remotas exigem revisão, staging e confirmação explícita.
- Uploads futuros devem validar MIME real, tamanho, dimensão, caminho aleatório e alt text.
- A aplicação não embute chave privada de mapas; o MVP cria link para OpenStreetMap.

Pendência: completar políticas de Storage e trilha automática de auditoria junto ao primeiro CRUD de upload.
