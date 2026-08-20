# Prompt para reativar a infraestrutura do Guia Vem Pra Torres

Copie e envie integralmente o prompt abaixo ao Codex quando o trabalho neste repositório for retomado.

---

Retome o projeto **Guia Vem Pra Torres** no repositório `/guiavempratorres` e reative, de forma segura, as sessões das nuvens já existentes. Não crie projetos, recursos, bancos, ambientes, secrets ou deployments novos durante a reativação.

## Estado conhecido na pausa

- Branch de produção: `main`
- Último commit validado na pausa: `e2db282`
- Produção canônica: `https://guiavempratorres.com.br`
- Domínio alternativo: `https://www.guiavempratorres.com.br`
- Alias Vercel: `https://guiavempratorres.vercel.app`
- Estado do último deployment: `Ready`
- Fluxo vigente: desenvolvimento e publicação em Production, sempre respeitando a autorização do usuário e as regras de `AGENTS.md`.
- Stack: Next.js App Router, Vercel, Supabase Cloud e GCP.

O commit indicado é apenas uma referência histórica. Ao retomar, consulte `origin/main` e não faça reset nem descarte alterações para forçar esse commit.

## Contas, projetos e dependências autorizadas

### Vercel

- Conta principal: `contato@vempratorres.com.br`
- Equipe: `vem-pra-torres`
- Projeto: `guiavempratorres`
- Painel: `https://vercel.com/vem-pra-torres/guiavempratorres`
- Produção canônica: `https://guiavempratorres.com.br`
- Domínio alternativo: `https://www.guiavempratorres.com.br`
- Alias Vercel: `https://guiavempratorres.vercel.app`

### Supabase Cloud

- Conta principal: `contato@vempratorres.com.br`
- Nome do projeto: `guiavempratorres`
- Project ref vigente: `lcfkoltbcpaoauzlegsl`
- Organization ID: `ljfsuuapozqveecvqwxy`
- Painel: `https://supabase.com/dashboard/project/lcfkoltbcpaoauzlegsl`
- O ref antigo `ggdynlmtvkvrpeyozsxn` ficou obsoleto após a recriação e **não deve ser usado**.

### GCP principal

- Conta: `contato@vempratorres.com.br`
- Projeto: `guiavempratorres`
- Console: `https://console.cloud.google.com/welcome?project=guiavempratorres`

### GCP exclusivo para Geocoding API

- Conta com acesso: `easywayconsultoria@gmail.com`
- Projeto operacional com faturamento: `staging-503122`
- Console: `https://console.cloud.google.com/welcome?project=staging-503122`
- Finalidade aprovada: **somente Google Geocoding API** para interpretar URLs do Google Maps no cadastro.
- Não migrar outros recursos para esse projeto, não habilitar APIs adicionais e não substituir o projeto GCP principal.
- A chave usada pela aplicação deve permanecer somente nas variáveis protegidas da Vercel; nunca mostre ou versione seu valor.

## Regras de segurança

1. Leia integralmente `AGENTS.md` antes de qualquer ação.
2. Use Node 22 e pnpm.
3. Confirme caminho, branch, remote e `git status --short`; preserve todas as alterações locais.
4. Faça inicialmente apenas verificações de leitura. A reativação não autoriza alterações em Production, banco, RLS, Storage, domínio, billing, APIs, IAM ou ambientes.
5. Nunca mostre senhas, tokens, chaves, cookies, service-role keys, conteúdo de `.env*` ou JSON de conta de serviço.
6. Nunca grave credenciais neste arquivo, no Git, em documentação ou em comandos que possam aparecer no histórico.
7. Solicite autenticação somente pelos fluxos oficiais OAuth/device login. Não peça a senha do e-mail.
8. Se um secret for indispensável, peça que o usuário o coloque na área de transferência, use-o sem imprimi-lo e mantenha-o somente no ambiente autorizado.
9. Antes de qualquer comando Supabase remoto, execute `pnpm db:check` com os identificadores esperados no ambiente.
10. Não execute migrations, SQL remoto, reset, repair, deploy ou operação destrutiva durante a reativação.
11. Não altere configurações somente para fazer uma verificação passar. Em caso de divergência entre este arquivo e o ambiente remoto, pare e informe o usuário.

## Procedimento de reativação

### 1. Auditoria local

- Confirme que o repositório é o `guiavempratorres` e leia `AGENTS.md`.
- Execute `git status --short`, `git branch --show-current`, `git remote -v` e consulte `origin/main`.
- Preserve o worktree; não use reset, checkout destrutivo ou limpeza de arquivos.
- Verifique a versão com `node --version` e use Node 22.
- Verifique a existência de `.vercel/project.json` e `supabase/.temp/project-ref` sem revelar credenciais.

### 2. Vercel

- Execute `vercel whoami`.
- Se a sessão não tiver acesso à equipe `vem-pra-torres`, execute `vercel login` e peça ao usuário para autorizar com `contato@vempratorres.com.br`.
- Confirme por leitura a equipe `vem-pra-torres`, o projeto `guiavempratorres`, o target Production, os domínios `guiavempratorres.com.br` e `www.guiavempratorres.com.br` e o alias `guiavempratorres.vercel.app`.
- Se o diretório não estiver vinculado, vincule exclusivamente ao projeto existente; nunca crie outro.
- Confirme que a proteção de acesso e os domínios existentes permanecem inalterados.
- Não faça deploy durante a reativação.

### 3. Supabase

- Use o CLI fixado pelo projeto (`pnpm exec supabase` ou `node_modules/.bin/supabase`).
- Verifique a sessão com `pnpm exec supabase projects list --output json`.
- Se necessário, autentique com um Personal Access Token criado pela conta autorizada. Solicite o token pela área de transferência e nunca o imprima.
- Confirme projeto `lcfkoltbcpaoauzlegsl`, nome `guiavempratorres` e organização `ljfsuuapozqveecvqwxy`.
- Configure apenas na sessão local, sem versionar:
  - `SUPABASE_PROJECT_REF=lcfkoltbcpaoauzlegsl`
  - `SUPABASE_PROJECT_NAME=guiavempratorres`
  - `SUPABASE_ORGANIZATION_ID=ljfsuuapozqveecvqwxy`
- Confirme que `supabase/.temp/project-ref` aponta para `lcfkoltbcpaoauzlegsl`.
- Execute `pnpm db:check`. Só considere o Supabase reativado quando essa verificação passar.
- Não use o ref obsoleto e não execute migration, push, reset, repair ou SQL.

### 4. GCP principal

- Execute `gcloud auth list` e `gcloud config get-value project`.
- Se necessário, autentique `contato@vempratorres.com.br` pelo navegador.
- Selecione somente o projeto existente `guiavempratorres` e confirme account/project ativos.
- Não habilite APIs nem altere billing, IAM, quotas, chaves ou recursos.

### 5. GCP de Geocoding

- Só reative esta sessão se uma tarefa funcional precisar testar a importação de localização por URL do Google Maps.
- Confirme acesso de `easywayconsultoria@gmail.com` ao projeto `staging-503122`.
- Confirme apenas que a Geocoding API necessária está disponível; não habilite serviços nem altere faturamento.
- Verifique somente a existência do nome da variável de Geocoding na Vercel, sem exibir seu valor.
- Depois da verificação, não deixe o projeto secundário selecionado como projeto GCP principal do trabalho.

## Critério de conclusão

Considere a reativação concluída somente quando:

- a Vercel estiver autenticada com acesso à equipe e ao projeto existentes;
- o Supabase CLI enxergar `lcfkoltbcpaoauzlegsl` e `pnpm db:check` for aprovado;
- o GCP principal estiver confirmado em `contato@vempratorres.com.br` / `guiavempratorres`;
- quando necessário, a dependência de Geocoding estiver confirmada separadamente em `easywayconsultoria@gmail.com` / `staging-503122`;
- nenhum recurso, secret, banco, configuração ou deployment tiver sido criado ou alterado;
- nenhuma credencial tiver sido exibida ou versionada.

Ao final, informe apenas identidades, projetos confirmados, comandos de verificação e eventuais bloqueios. Não revele secrets.

---

Este arquivo documenta somente a retomada segura das sessões. Alterações de infraestrutura, banco ou publicação continuam exigindo escopo funcional e autorização conforme `AGENTS.md`.
