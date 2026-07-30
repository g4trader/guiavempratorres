import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const expectedRef = process.env.SUPABASE_PROJECT_REF?.trim();
const expectedName = process.env.SUPABASE_PROJECT_NAME?.trim();
const expectedOrganization = process.env.SUPABASE_ORGANIZATION_ID?.trim();
const linkedRefPath = resolve("supabase/.temp/project-ref");
const migrationsPath = resolve("supabase/migrations");
const forbiddenSql = /\b(DROP\s+DATABASE|DROP\s+SCHEMA|TRUNCATE|DROP\s+TABLE|DELETE\s+FROM)\b/i;

const mask = (value) =>
  value && value.length > 8 ? `${value.slice(0, 4)}…${value.slice(-4)}` : "não configurado";

function fail(message) {
  process.stderr.write(`Supabase project check falhou: ${message}\n`);
  process.exit(1);
}

if (!expectedRef || !expectedName || !expectedOrganization) {
  fail("SUPABASE_PROJECT_REF, SUPABASE_PROJECT_NAME e SUPABASE_ORGANIZATION_ID são obrigatórios.");
}

if (expectedName !== "guiavempratorres") {
  fail("SUPABASE_PROJECT_NAME deve ser exatamente guiavempratorres.");
}

if (expectedOrganization !== "ljfsuuapozqveecvqwxy") {
  fail("SUPABASE_ORGANIZATION_ID não corresponde à organização autorizada.");
}

let linkedRef;
try {
  linkedRef = (await readFile(linkedRefPath, "utf8")).trim();
} catch {
  fail("nenhum projeto Supabase está vinculado neste diretório.");
}

if (linkedRef !== expectedRef) {
  fail(`project ref vinculado ${mask(linkedRef)} difere do ref autorizado.`);
}

const cliEnvironment = { ...process.env, TERM: "xterm", NO_COLOR: "1" };
delete cliEnvironment.CODEX_CI;
const projectsResult = spawnSync(
  "supabase",
  ["projects", "list", "--output", "json", "--agent", "no"],
  { encoding: "utf8", env: cliEnvironment }
);

if (projectsResult.status !== 0) {
  fail("não foi possível confirmar os metadados do projeto pela Supabase CLI.");
}

let projects;
try {
  projects = JSON.parse(projectsResult.stdout);
} catch {
  fail("a Supabase CLI retornou metadados em formato inesperado.");
}

const project = projects.find((candidate) => (candidate.ref ?? candidate.id) === expectedRef);
if (!project) {
  fail(`project ref ${mask(expectedRef)} não está acessível na conta autenticada.`);
}

if (project.name !== expectedName) {
  fail("o nome remoto do projeto não corresponde a guiavempratorres.");
}

if (project.organization_id !== expectedOrganization) {
  fail("a organização remota do projeto não corresponde à organização autorizada.");
}

const migrationFiles = (await readdir(migrationsPath))
  .filter((name) => name.endsWith(".sql"))
  .sort();

for (const migrationFile of migrationFiles) {
  const sql = await readFile(resolve(migrationsPath, migrationFile), "utf8");
  const match = sql.match(forbiddenSql);
  if (match) {
    fail(`a migration ${migrationFile} contém operação destrutiva bloqueada: ${match[1]}.`);
  }
}

process.stdout.write(
  `Supabase autorizado: ${expectedName} (${mask(expectedRef)}), organização confirmada.\n`
);
