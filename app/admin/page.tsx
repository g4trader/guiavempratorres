import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/app/admin/actions";
import { requestPasswordReset } from "@/app/admin/content-actions";
import { Logo } from "@/components/layout/Logo";
import { AdminNav } from "@/components/admin/AdminNav";
import { createAuthenticatedServerClient, requireAdmin } from "@/lib/supabase/auth-server";

export const metadata = {
  title: "Área administrativa",
  robots: { index: false, follow: false }
};

type Props = { searchParams: Promise<{ erro?: string; mensagem?: string }> };

export default async function AdminPage({ searchParams }: Props) {
  const client = await createAuthenticatedServerClient();
  const {
    data: { user }
  } = (await client?.auth.getUser()) ?? { data: { user: null } };

  if (client && user) {
    const { data: membership } = await client
      .from("admin_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();
    if (membership) {
      const { client: adminClient } = await requireAdmin();
      const [plans, categories, businesses, items, campaigns, users] = await Promise.all([
        adminClient.from("plans").select("*", { count: "exact", head: true }),
        adminClient.from("categories").select("*", { count: "exact", head: true }),
        adminClient.from("businesses").select("*", { count: "exact", head: true }),
        adminClient.from("business_items").select("*", { count: "exact", head: true }),
        adminClient.from("ad_campaigns").select("*", { count: "exact", head: true }),
        adminClient.from("profiles").select("*", { count: "exact", head: true })
      ]);
      const stats = [
        ["Planos", plans.count ?? 0, "/admin/planos"],
        ["Categorias", categories.count ?? 0, "/admin/categorias"],
        ["Páginas de empresas", businesses.count ?? 0, "/admin/empresas"],
        ["Itens", items.count ?? 0, "/admin/itens"],
        ["Banners", campaigns.count ?? 0, "/admin/campanhas"],
        ["Usuários", users.count ?? 0, "/admin/usuarios"]
      ] as const;
      return (
        <>
          <AdminNav />
          <main className="container admin-page">
            <div className="admin-title">
              <div>
                <span className="eyebrow">Visão geral</span>
                <h1>Dashboard</h1>
              </div>
              <span>Operação do guia</span>
            </div>
            <section className="admin-dashboard" aria-label="Indicadores">
              {stats.map(([label, count, href]) => (
                <Link className="admin-stat" href={href} key={label}>
                  <span>{label}</span>
                  <strong>{count}</strong>
                  <small>Gerenciar →</small>
                </Link>
              ))}
            </section>
          </main>
        </>
      );
    }
  }

  const { erro, mensagem } = await searchParams;
  const message =
    erro === "permissao"
      ? "Seu usuário não possui um papel administrativo."
      : erro
        ? "Não foi possível entrar. Verifique seus dados."
        : null;

  return (
    <div className="container section">
      <div className="panel admin-login">
        <Logo className="admin-logo" priority />
        <span className="eyebrow">Acesso restrito</span>
        <h1>Área administrativa</h1>
        {message ? (
          <p className="form-message error" role="alert">
            {message}
          </p>
        ) : null}
        {mensagem ? (
          <p className="form-message" role="status">
            {mensagem === "recuperacao"
              ? "Se o e-mail existir, você receberá o link para redefinir a senha."
              : "Senha alterada. Entre novamente."}
          </p>
        ) : null}
        <form action={signIn} className="admin-form">
          <label>
            E-mail
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Senha
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button className="button" type="submit">
            Entrar
          </button>
        </form>
        <details>
          <summary>Esqueci minha senha</summary>
          <form action={requestPasswordReset} className="admin-form">
            <label>
              E-mail
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <button className="button secondary" type="submit">
              Enviar link
            </button>
          </form>
        </details>
        <Link href="/">Voltar ao site</Link>
      </div>
    </div>
  );
}
