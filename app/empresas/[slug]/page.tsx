import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublishedBusinessBySlug,
  listActiveCategories,
  listPublishedBusinessesByCategory
} from "@/lib/data/directory";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const categories = await listActiveCategories();
  const groups = await Promise.all(
    categories.map((category) => listPublishedBusinessesByCategory(category.slug))
  );
  return [...new Set(groups.flat().map(({ slug }) => slug))].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = await getPublishedBusinessBySlug(slug);
  if (!business) return {};
  return {
    title: business.name,
    description: business.shortDescription,
    alternates: { canonical: `/empresas/${slug}` }
  };
}

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params;
  const business = await getPublishedBusinessBySlug(slug);
  if (!business) notFound();

  const hasCoordinates = business.latitude !== null && business.longitude !== null;
  const mapUrl = hasCoordinates
    ? `https://www.openstreetmap.org/?mlat=${business.latitude}&mlon=${business.longitude}#map=16/${business.latitude}/${business.longitude}`
    : null;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.shortDescription,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.addressLine || undefined,
      addressLocality: business.city,
      addressRegion: "RS",
      addressCountry: "BR"
    }
  };
  const contacts = [
    business.phone ? { label: "Telefone", value: business.phone } : null,
    business.whatsapp ? { label: "WhatsApp", value: business.whatsapp } : null,
    business.email ? { label: "E-mail", value: business.email } : null,
    business.websiteUrl ? { label: "Site", value: business.websiteUrl } : null,
    business.instagramUrl ? { label: "Instagram", value: business.instagramUrl } : null
  ].filter((contact): contact is { label: string; value: string } => contact !== null);

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c")
        }}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Início</Link> / {business.name}
      </nav>
      <header className="page-header">
        <span className="eyebrow">Empresa local</span>
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
                  {item.price !== undefined ? (
                    <p className="price">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      }).format(item.price)}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </article>
        </div>
        <aside className="stack">
          {contacts.length > 0 ? (
            <div className="panel">
              <h2>Contatos</h2>
              {contacts.map((contact) => (
                <p key={contact.label}>
                  <strong>{contact.label}:</strong> {contact.value}
                </p>
              ))}
            </div>
          ) : null}
          <div className="panel">
            <h2>Localização</h2>
            <p>
              {business.addressLine ? `${business.addressLine}, ` : ""}
              {business.neighborhood ? `${business.neighborhood}, ` : ""}
              {business.city} — RS
            </p>
            {mapUrl ? (
              <a className="button secondary" href={mapUrl} target="_blank" rel="noreferrer">
                Abrir no mapa
              </a>
            ) : null}
          </div>
        </aside>
      </section>
    </div>
  );
}
