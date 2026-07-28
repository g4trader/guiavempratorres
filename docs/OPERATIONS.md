# Operações

## Regra de ambientes

Produção não é alterada. Toda migration nasce em `supabase/migrations`, passa
por revisão e proteção de project ref, e então é aplicada no único Supabase
Cloud autorizado. Não usar Docker, Supabase local, PostgreSQL local ou
emuladores.

## Acessos oficiais

Use login via navegador nas CLIs (`gh auth login`, `vercel login`, `supabase login`, `gcloud auth login`). Nunca cole senhas, tokens, service-role keys ou JSON de service account no chat ou no repositório.

## Rotina

1. `pnpm install --frozen-lockfile`
2. `pnpm db:check`
3. `pnpm db:lint`
4. revisar migrations e executar `pnpm db:push`
5. gerar tipos com `pnpm db:types`
6. `pnpm lint && pnpm typecheck && pnpm test && pnpm build`

`SUPABASE_PROJECT_REF`, `SUPABASE_PROJECT_NAME` e
`SUPABASE_ORGANIZATION_ID` são obrigatórios para scripts remotos. A proteção lê
`supabase/.temp/project-ref`, confirma os metadados remotos pela CLI, rejeita ref
ausente, desconhecido ou divergente e bloqueia migrations com operações
destrutivas, sem imprimir secrets.

Durante o desenvolvimento, variáveis Supabase são configuradas na Vercel
Preview. Service role permanece server-only. Production Vercel não é alterada
sem autorização.

Deploy de Preview só ocorre após projeto/equipe/variáveis terem sido auditados.

## Projetos confirmados

- Vercel: equipe `vem-pra-torres`, projeto `guiavempratorres`;
- Supabase oficial: pendente de criação, nome obrigatório `guiavempratorres`,
  organização `ljfsuuapozqveecvqwxy`, região `sa-east-1`;
- GCP: `guiavempratorres`, região aprovada `southamerica-east1`.

## Deployment inicial da Vercel

- deployment inicial: <https://guiavempratorres.vercel.app>;
- classificação Vercel: `production`;
- estado: `Ready`;
- acesso: protegido por autenticação Vercel;
- indexação: `noindex`;
- Supabase: não conectado;
- secrets: não configurados;
- domínio personalizado: não conectado;
- commit: `002cfba`;
- E2E: 2/2 aprovados, desktop e mobile.

Esse deployment protegido será mantido. Não remover a proteção, conectar domínio
personalizado, configurar secrets de produção ou executar novo deploy de
produção sem autorização explícita.

Antes do próximo deploy:

1. auditar por que o primeiro comando sem `--prod` recebeu alvo `production`;
2. confirmar a branch de produção e a origem Git do deployment;
3. garantir branches e pull requests em Preview;
4. garantir que `main` só chegue a Production com autorização;
5. confirmar o único projeto Supabase autorizado antes de qualquer integração.

### Auditoria do primeiro deployment

Auditoria realizada em 2026-07-27 pela CLI e API oficial da Vercel:

- o comando executado foi `vercel deploy --yes --scope vem-pra-torres`, sem
  `--prod`;
- não existia variável de ambiente `VERCEL_*` forçando um alvo;
- a API registrou `target: production`, `readyState: READY` e
  `readySubstate: PROMOTED`;
- os metadados do deployment confirmam `githubCommitRef: main`,
  `githubCommitSha: 002cfba01e0df9464ab9cbb0435aeb82dee6d054` e
  `githubDeployment: 1`;
- no momento da execução, `HEAD`, `origin/main` e `origin/HEAD` apontavam para
  esse commit;
- o projeto não possui repositório Git conectado (`gitRepository: null`);
- por não existir integração Git, não há branch de produção configurada
  (`productionBranch: null`);
- a proteção SSO está configurada para todos os deployments, exceto domínios
  personalizados; nenhum bypass ou proteção por senha foi configurado;
- nenhum domínio personalizado foi conectado.
- o runtime do projeto foi alinhado de Node 24.x para Node 22.x, conforme
  `package.json`, sem disparar deployment.

A documentação atual da Vercel define `vercel deploy` como Preview e
`vercel deploy --prod` como Production. Os dados disponíveis não mostram uma
configuração remota que explique a promoção. A classificação é tratada como uma
anomalia/inferência da CLI Vercel 48 no primeiro deployment do projeto novo ao
detectar o repositório local em `main`; essa causa não deve ser apresentada como
confirmada pela plataforma.

### Fluxo de ambientes

- desenvolvimento continua em branches `feature/*`, `fix/*` ou `chore/*`;
- branches e pull requests podem gerar Preview;
- deployments manuais de branch devem usar explicitamente
  `vercel deploy --target=preview`;
- `vercel.json` desabilita deployments Git automáticos de `main` e permite as
  demais branches;
- Production requer autorização explícita e comando deliberado com `--prod`;
- não conectar domínio personalizado, remover proteção ou configurar secrets de
  produção nesta fase;
- o único projeto Supabase deve passar pela proteção antes de integrar banco ou
  Auth a qualquer Preview.

## Backup e recuperação

Antes de inserir dados reais:

- confirmar no painel quais backups e retenção o plano contratado oferece;
- registrar o responsável por exportações e restaurações;
- definir exportação periódica compatível com o plano;
- testar restauração em ambiente seguro quando houver recurso disponível;
- documentar RPO/RTO e limitações reais do plano.

Antes de migration potencialmente destrutiva, obter autorização explícita,
registrar ponto de restauração, gerar exportação/backup adequado e revisar
rollback. O script bloqueia `DROP DATABASE`, `DROP SCHEMA`, `TRUNCATE`,
`DROP TABLE` e `DELETE FROM`; `db reset`, exclusão de projetos/branches e
`migration repair` não fazem parte dos scripts do repositório.

A integração GitHub da Vercel ainda depende da conexão da conta Vercel com o
GitHub. Até ela ser concluída, pushes e pull requests não geram deployments
automáticos e a branch de produção permanece sem configuração remota.

### Validação do fluxo Preview

Em 2026-07-27, a branch `chore/vercel-environment-guardrails` foi publicada com
alvo explícito:

```bash
vercel deploy --yes --target=preview --scope vem-pra-torres
```

Resultado:

- URL:
  <https://guiavempratorres-4ep8sl1fm-vem-pra-torres.vercel.app>;
- deployment: `dpl_5pRQxawJn8zrW3oYdcYRWcMKNnXE`;
- target: `preview`;
- estado: `Ready`;
- acesso: protegido por autenticação Vercel;
- indexação: `noindex`;
- commit da branch: `dcdccb1`;
- nenhum secret, Supabase ou domínio personalizado foi conectado;
- o deployment de Production anterior não foi alterado.
