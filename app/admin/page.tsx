import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/app/admin/actions";
import { Logo } from "@/components/layout/Logo";
import { createAuthenticatedServerClient } from "@/lib/supabase/auth-server";

export const metadata = {
  title: "Área administrativa",
  robots: { index: false, follow: false }
};

type Props = { searchParams: Promise<{ erro?: string }> };

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
    if (membership) redirect("/admin/planos");
  }

  const { erro } = await searchParams;
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
        <Link href="/">Voltar ao site</Link>
      </div>
    </div>
  );
}
