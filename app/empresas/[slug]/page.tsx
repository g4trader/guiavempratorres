import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { businesses, categories } from "@/lib/fixtures";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return businesses.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = businesses.find((item) => item.slug === slug);
  if (!business) return {};
  return {
    title: business.name,
    description: business.shortDescription,
    alternates: { canonical: `/empresas/${slug}` }
  };
}

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params;
  const business = businesses.find((item) => item.slug === slug);
  if (!business) notFound();
  const category = categories.find((item) => business.categorySlugs.includes(item.slug));
  const mapUrl = `https://www.openstreetmap.org/?mlat=${business.latitude}&mlon=${business.longitude}#map=16/${business.latitude}/${business.longitude}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.shortDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.city,
      addressRegion: "RS",
      addressCountry: "BR"
    }
  };
  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c")
        }}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Início</Link> /{" "}
        <Link href={`/categorias/${category?.slug ?? "servicos"}`}>
          {category?.name ?? "Empresas"}
        </Link>{" "}
        / {business.name}
      </nav>
      <header className="page-header">
        <span className="eyebrow">{category?.name}</span>
        <h1>{business.name}</h1>
        <p className="muted">{business.shortDescription}</p>
      </header>
      <Image
        className="card"
        src={business.imageUrl}
        alt={business.imageAlt}
        width={1200}
        height={600}
        priority
      />
      <section className="section detail-grid">
        <div className="stack">
          <article className="panel">
            <h2>Sobre</h2>
            <p>{business.description}</p>
          </article>
          <article className="panel">
            <h2>Produtos e serviços</h2>
            <div className="stack">
              {business.products.map((item) => (
                <div key={item.name}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  {item.price !== undefined && (
                    <p className="price">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      }).format(item.price)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </article>
        </div>
        <aside className="panel">
          <h2>Localização</h2>
          <p>
            {business.neighborhood}, {business.city} — RS
          </p>
          <a className="button secondary" href={mapUrl} target="_blank" rel="noreferrer">
            Abrir no mapa
          </a>
        </aside>
      </section>
    </div>
  );
}
