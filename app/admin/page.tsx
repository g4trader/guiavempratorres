import { Logo } from "@/components/layout/Logo";

export const metadata = { title: "Área administrativa", robots: { index: false, follow: false } };

export default function AdminPage() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
  return (
    <div className="container section">
      <div className="panel" style={{ maxWidth: 560, margin: "0 auto" }}>
        <Logo className="admin-logo" />
        <span className="eyebrow">Acesso restrito</span>
        <h1>Área administrativa</h1>
        <p className="muted">
          {configured
            ? "A autenticação será realizada pelo Supabase Auth."
            : "O painel está protegido por configuração: conecte o projeto Supabase para habilitar o login. Não há autocadastro público."}
        </p>
      </div>
    </div>
  );
}
