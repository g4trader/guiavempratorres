/** Explicit opt-in to writes; the production database is never a test target. */
export function assertWritableTestEnvironment(env: Record<string, string | undefined>) {
  if (env.E2E_ALLOW_WRITES !== "true")
    throw new Error("Defina E2E_ALLOW_WRITES=true somente para dados de teste autorizados.");
  const ref = env.E2E_SUPABASE_PROJECT_REF;
  if (!ref || ref === "lcfkoltbcpaoauzlegsl")
    throw new Error("Testes de escrita exigem projeto cloud de testes separado da produção.");
  const database = new URL(env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  if (database.protocol !== "https:" || database.hostname !== `${ref}.supabase.co`)
    throw new Error("URL Supabase não corresponde ao projeto E2E autorizado.");
  const app = new URL(env.E2E_BASE_URL ?? "http://127.0.0.1:3000");
  if (
    [
      "guiavempratorres.com.br",
      "www.guiavempratorres.com.br",
      "guiavempratorres.vercel.app"
    ].includes(app.hostname)
  )
    throw new Error("Testes de escrita não podem usar o site de produção.");
}
