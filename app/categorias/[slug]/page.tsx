import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/public/BusinessCard";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import {
  getActiveCategoryBySlug,
  getValidCategoryHeroCampaigns,
  listPublishedBusinessesByCategory
} from "@/lib/data/directory";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pagina?: string; ordem?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getActiveCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.seoTitle ?? category.name,
    description: category.seoDescription ?? category.description,
    alternates: { canonical: `/categorias/${slug}` },
    openGraph: {
      title: `${category.name} em Torres`,
      description: category.seoDescription ?? category.description,
      url: `/categorias/${slug}`,
      images: [{ url: category.imageUrl, alt: category.imageAlt }]
    }
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const category = await getActiveCategoryBySlug(slug);
  if (!category) notFound();
  const page = Math.max(1, Number(query.pagina) || 1);
  const order = ["priority", "recent", "name"].includes(query.ordem ?? "")
    ? (query.ordem ?? "priority")
    : "priority";
  const [result, campaigns] = await Promise.all([
    listPublishedBusinessesByCategory(slug, page, 9, order),
    getValidCategoryHeroCampaigns(category.id)
  ]);

  return (
    <>
      <nav className="container breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Início</Link> / {category.name}
      </nav>
      {campaigns.length ? (
        <div className="hero category-page-hero">
          <HeroCarousel campaigns={campaigns} />
        </div>
      ) : null}
      <div className="container">
        <header className="page-header">
          <span className="eyebrow">Categoria</span>
          <h1>{category.name}</h1>
          {category.description ? <p className="muted">{category.description}</p> : null}
          <p>
            {result.total} {result.total === 1 ? "empresa encontrada" : "empresas encontradas"}
          </p>
        </header>
        <form className="listing-toolbar">
          <label>
            Ordenar por
            <select name="ordem" defaultValue={order}>
              <option value="priority">Premium e destaques</option>
              <option value="recent">Mais recentes</option>
              <option value="name">Nome</option>
            </select>
          </label>
          <button className="button secondary" type="submit">
            Ordenar
          </button>
        </form>
        {result.businesses.length ? (
          <div className="grid">
            {result.businesses.map((business) => (
              <BusinessCard business={business} key={business.id} />
            ))}
          </div>
        ) : (
          <div className="empty">Ainda não há empresas publicadas nesta categoria.</div>
        )}
        {result.totalPages > 1 ? (
          <nav className="pagination" aria-label="Paginação">
            {Array.from({ length: result.totalPages }, (_, index) => index + 1).map((number) => (
              <Link
                key={number}
                aria-current={number === page ? "page" : undefined}
                href={`/categorias/${slug}?pagina=${number}&ordem=${order}`}
              >
                {number}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </>
  );
}
