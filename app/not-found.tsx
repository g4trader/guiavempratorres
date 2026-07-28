import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container section empty">
      <h1>Página não encontrada</h1>
      <p>O conteúdo pode ter mudado ou ainda não foi publicado.</p>
      <Link className="button" href="/">
        Voltar ao início
      </Link>
    </div>
  );
}
