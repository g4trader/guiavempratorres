import Link from "next/link";
import type { Route } from "next";
import { signOut } from "@/app/admin/actions";
import { Logo } from "@/components/layout/Logo";

const links: { label: string; href: string }[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Planos", href: "/admin/planos" },
  { label: "Categorias", href: "/admin/categorias" },
  { label: "Páginas de empresas", href: "/admin/empresas" },
  { label: "Banners", href: "/admin/campanhas" },
  { label: "Usuários", href: "/admin/usuarios" }
];

export function AdminNav() {
  return (
    <header className="admin-header">
      <div className="container admin-nav">
        <Link href="/admin" aria-label="Dashboard">
          <Logo className="admin-nav-logo" priority />
        </Link>
        <nav aria-label="Administração">
          {links.map(({ label, href }) => (
            <Link key={label} href={href as Route}>
              {label}
            </Link>
          ))}
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
