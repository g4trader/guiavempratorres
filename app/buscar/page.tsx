import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { searchDirectory } from "@/lib/data/directory";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busque empresas, categorias, produtos e serviços em Torres.",
  robots: { index: false, follow: true }
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const query = (await searchParams).q?.trim() ?? "";
  const results = await searchDirectory(query);
  return (
    <div className="container section">
      <header className="page-header">
        <span className="eyebrow">Busca</span>
        <h1>Encontre em Torres</h1>
      </header>
      <form className="search-form" action="/buscar">
        <label className="sr-only" htmlFor="directory-search">
          Termo da busca
        </label>
        <input
          id="directory-search"
          type="search"
          name="q"
          minLength={2}
          required
          defaultValue={query}
          placeholder="Empresa, categoria, produto ou serviço"
        />
        <button className="button" type="submit">
          Buscar
        </button>
      </form>
      {query.length >= 2 ? (
        <>
          <p className="search-count">
            {results.length} {results.length === 1 ? "resultado" : "resultados"} para “{query}”
          </p>
          {results.length ? (
            <div className="search-results">
              {results.map((result) => (
                <article className="panel" key={`${result.kind}-${result.id}`}>
                  <span className="eyebrow">{result.context}</span>
                  <h2>
                    <Link href={result.href as Route}>{result.title}</Link>
                  </h2>
                  {result.description ? <p>{result.description}</p> : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">Nenhum resultado encontrado.</div>
          )}
        </>
      ) : (
        <div className="empty">Digite ao menos dois caracteres para buscar.</div>
      )}
    </div>
  );
}
