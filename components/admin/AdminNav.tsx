import Link from "next/link";
import type { Route } from "next";
import { signOut } from "@/app/admin/actions";
import { Logo } from "@/components/layout/Logo";

const links: { label: string; href?: Route }[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Planos", href: "/admin/planos" },
  { label: "Categorias" },
  { label: "Empresas" },
  { label: "Itens", href: "/admin/itens" },
  { label: "Campanhas" },
  { label: "Usuários" }
];

export function AdminNav() {
  return (
    <header className="admin-header">
      <div className="container admin-nav">
        <Link href="/admin" aria-label="Dashboard">
          <Logo className="admin-nav-logo" priority />
        </Link>
        <nav aria-label="Administração">
          {links.map(({ label, href }) =>
            href ? (
              <Link key={label} href={href}>
                {label}
              </Link>
            ) : (
              <span className="admin-nav-pending" key={label}>
                {label}
              </span>
            )
          )}
        </nav>
        <form action={signOut}>
          <button className="button secondary" type="submit">
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}
