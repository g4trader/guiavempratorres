import type { Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signInGuideUser, signUpGuideUser } from "@/app/entrar/actions";
import { Logo } from "@/components/layout/Logo";
import { createAuthenticatedServerClient } from "@/lib/supabase/auth-server";

export const metadata = {
  title: "Entrar no Guia",
  robots: { index: false, follow: false }
};

type Props = {
  searchParams: Promise<{ retorno?: string; erro?: string; mensagem?: string }>;
};

export default async function GuideLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const destination =
    params.retorno?.startsWith("/") && !params.retorno.startsWith("//") ? params.retorno : "/";
  const client = await createAuthenticatedServerClient();
  const {
    data: { user }
  } = (await client?.auth.getUser()) ?? { data: { user: null } };
  if (user) redirect(destination as Route);

  return (
    <main className="container section guide-login">
      <div className="panel">
        <Logo priority />
        <span className="eyebrow">Comunidade do Guia</span>
        <h1>Entre para avaliar</h1>
        {params.erro ? (
          <p className="form-message error" role="alert">
            Não foi possível concluir. Verifique os dados e tente novamente.
          </p>
        ) : null}
        {params.mensagem === "confirmacao" ? (
          <p className="form-message" role="status">
            Confira seu e-mail para confirmar o cadastro.
          </p>
        ) : null}
        <form action={signInGuideUser} className="admin-form">
          <input type="hidden" name="retorno" value={destination} />
          <h2>Já tenho cadastro</h2>
          <label>
            E-mail
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            Senha
            <input name="password" type="password" minLength={8} required autoComplete="current-password" />
          </label>
          <button className="button" type="submit">Entrar</button>
        </form>
        <form action={signUpGuideUser} className="admin-form">
          <input type="hidden" name="retorno" value={destination} />
          <h2>Criar cadastro</h2>
          <label>
            Nome
            <input name="display_name" required minLength={2} autoComplete="name" />
          </label>
          <label>
            E-mail
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            Senha
            <input name="password" type="password" minLength={8} required autoComplete="new-password" />
          </label>
          <button className="button secondary" type="submit">Criar cadastro</button>
        </form>
        <Link href={destination as Route}>Voltar</Link>
      </div>
    </main>
  );
}
