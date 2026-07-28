import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Guia Vem Pra Torres", template: "%s | Guia Vem Pra Torres" },
  description: "Empresas, profissionais, produtos e serviços de Torres e região.",
  openGraph: { locale: "pt_BR", type: "website", siteName: "Guia Vem Pra Torres" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <header className="site-header">
          <nav className="container nav" aria-label="Navegação principal">
            <Link className="brand" href="/">
              Vem pra Torres · Guia
            </Link>
            <div className="nav-links">
              <Link href="/#categorias">Categorias</Link>
              <Link href="/admin">Área administrativa</Link>
              <Link className="button" href="/#categorias">
                Explorar o guia
              </Link>
            </div>
          </nav>
        </header>
        <main id="conteudo">{children}</main>
        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <strong>Guia Vem Pra Torres</strong>
              <p>Descubra o melhor de Torres e região.</p>
            </div>
            <div>
              <strong>Navegue</strong>
              <p>
                <Link href="/#categorias">Categorias</Link>
              </p>
            </div>
            <div>
              <strong>Anunciantes</strong>
              <p>
                <Link href="/admin">Acessar painel</Link>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
