# Operações

Responsável por acessos, faturamento, backups e alertas: `contato@vempratorres.com.br`, confirmado em 23/10/2026.

## Projetos

- GitHub: `g4trader/guiavempratorres`.
- Vercel: equipe `vem-pra-torres`, projeto `guiavempratorres`.
- Produção: `https://www.guiavempratorres.com.br`.
- Supabase: `guiavempratorres`, ref `lcfkoltbcpaoauzlegsl`, organização `ljfsuuapozqveecvqwxy`.
- GCP principal registrado: `guiavempratorres`. Geocoding teve registro separado em `staging-503122`; confirmar propriedade da chave efetiva antes de transferir.

## Banco

Exportar os identificadores de proteção no terminal; `.env.local` do Next não é carregado automaticamente pelo script Node. Em checkout vinculado e CLI autenticada:

```bash
pnpm db:check
```

Somente após confirmação do projeto e autorização da alteração:

```bash
pnpm db:lint
pnpm db:push
pnpm db:types
```

Os três scripts incluem a proteção. Falha de metadados ou vínculo impede a operação; não contornar com ref fictícia. Não aplicar seed sobre dados reais. O bootstrap de um checkout novo deve ser acompanhado pelo responsável, pois a proteção exige vínculo já existente.

## Publicação

Executar lint, typecheck, testes e build antes de commit. Testar o fluxo afetado no navegador. Confirmar equipe, projeto, SHA e variáveis. Preview manual:

```bash
vercel deploy --target=preview --scope vem-pra-torres
```

Depois de autorização explícita para produção:

```bash
vercel deploy --prod --scope vem-pra-torres
```

Registrar deployment ID, SHA, aliases, Ready e smoke test. `vercel.json` desabilita deployments Git da main; push não é prova de publicação.

## Backup e incidentes

O responsável deve confirmar plano, retenção, backups de banco e cobertura dos objetos de Storage no painel Supabase. Um backup de banco não deve ser presumido como backup dos arquivos. Definir RPO/RTO e executar restauração em cloud de teste autorizado antes de declarar recuperação validada.

Em incidente, registrar horário, rotas afetadas, deployment e erros sem secrets. Para falha de código, avaliar rollback Vercel compatível com o schema, com autorização. Para falha de dados, suspender a operação causadora e preservar o ponto de restauração. Não executar reset.

Monitorar disponibilidade do domínio, erros de runtime Vercel, erros de Auth/Storage, banco, quota e faturamento Geocoding. Destinatário operacional: `contato@vempratorres.com.br`. A definição do destinatário não significa que alertas externos já foram configurados.

## Testes cloud

Não há projeto de testes separado confirmado nesta entrega. Os E2E de escrita bloqueiam o Supabase de produção. Provisionamento de ambiente, custo e acesso precisam de aprovação. `supabase/tests/rls_and_constraints.sql` usa IDs próprios e rollback, sem seed prévio, e requer pgTAP instalado no ambiente autorizado.

Ver [passagem técnica](HANDOFF_TECNICO.md) para estado de validação e pendências. Histórico anterior fica em `history/`.
