import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://guiavempratorres.vercel.app"),
  title: { default: "Guia Vem Pra Torres", template: "%s | Guia Vem Pra Torres" },
  description: "Empresas, profissionais, produtos e serviços de Torres e região.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/brand/favicon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/brand/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/placeholders/apple-touch-icon.svg", type: "image/svg+xml" }]
  },
  openGraph: {
    locale: "pt_BR",
    type: "website",
    siteName: "Guia Vem Pra Torres",
    images: [
      {
        url: "/placeholders/hero-desktop.svg",
        width: 1600,
        height: 720,
        alt: "Placeholder do Guia Vem Pra Torres"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    images: ["/placeholders/hero-desktop.svg"]
  }
};

export const viewport = {
  themeColor: "#2d9d78"
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
              <Logo priority className="brand-logo" />
              <span className="sr-only">Guia Vem Pra Torres</span>
            </Link>
            <div className="nav-links">
              <Link href="/#categorias">Categorias</Link>
              <Link href="/pontos-turisticos">Pontos turísticos</Link>
              <Link className="button header-cta" href="/#categorias">
                Explorar
              </Link>
              <details className="mobile-menu">
                <summary role="button" aria-label="Abrir menu de navegação">
                  <span aria-hidden="true" />
                  <span aria-hidden="true" />
                  <span aria-hidden="true" />
                </summary>
                <div className="mobile-menu-panel">
                  <Link href="/">Início</Link>
                  <Link href="/#categorias">Categorias</Link>
                  <Link href="/pontos-turisticos">Pontos turísticos</Link>
                </div>
              </details>
            </div>
          </nav>
        </header>
        <main id="conteudo">{children}</main>
        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <Logo variant="light" className="footer-logo" />
              <p>Descubra o melhor de Torres e região.</p>
            </div>
            <div>
              <strong>Navegue</strong>
              <p>
                <Link href="/#categorias">Categorias</Link>
              </p>
              <p>
                <Link href="/pontos-turisticos">Pontos turísticos</Link>
              </p>
              <p>
                <Link href={"/buscar" as Route}>Buscar</Link>
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
