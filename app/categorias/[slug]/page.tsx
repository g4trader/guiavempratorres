import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getActiveCategoryBySlug,
  listActiveCategories,
  listPublishedBusinessesByCategory
} from "@/lib/data/directory";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await listActiveCategories()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getActiveCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categorias/${slug}` }
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getActiveCategoryBySlug(slug);
  if (!category) notFound();
  const businesses = await listPublishedBusinessesByCategory(slug);

  return (
    <div className="container">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Início</Link> / {category.name}
      </nav>
      <header className="page-header">
        <span className="eyebrow">Categoria</span>
        <h1>{category.name}</h1>
        <p className="muted">{category.description}</p>
      </header>
      {businesses.length ? (
        <div className="grid">
          {businesses.map((business) => (
            <article className="card" key={business.slug}>
              <Image
                className="card-image"
                src={business.imageUrl}
                alt={business.imageAlt}
                width={640}
                height={400}
              />
              <div className="card-body">
                <h2>{business.name}</h2>
                <p>{business.shortDescription}</p>
                <p>
                  {business.neighborhood}, {business.city}
                </p>
                <a className="button secondary" href={`/empresas/${business.slug}`}>
                  Ver empresa
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty">Ainda não há empresas publicadas nesta categoria.</div>
      )}
    </div>
  );
}
