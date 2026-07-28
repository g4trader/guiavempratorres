import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedBusinessBySlug } from "@/lib/data/directory";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = await getPublishedBusinessBySlug(slug);
  if (!business) return {};
  return {
    title: business.seoTitle ?? business.name,
    description: business.seoDescription ?? business.shortDescription,
    alternates: { canonical: `/empresas/${slug}` },
    openGraph: {
      title: business.name,
      description: business.seoDescription ?? business.shortDescription,
      url: `/empresas/${slug}`,
      images: [{ url: business.imageUrl, alt: business.imageAlt }]
    }
  };
}

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params;
  const business = await getPublishedBusinessBySlug(slug);
  if (!business) notFound();

  const hasCoordinates = business.latitude !== null && business.longitude !== null;
  const mapUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`
    : null;
  const mapEmbedUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${business.latitude},${business.longitude}&z=15&output=embed`
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
    business.whatsapp
      ? {
          label: "WhatsApp",
          value: business.whatsapp,
          href: `https://wa.me/${business.whatsapp.replace(/\D/g, "")}`
        }
      : null,
    business.phone
      ? {
          label: "Telefone",
          value: business.phone,
          href: `tel:${business.phone.replace(/\D/g, "")}`
        }
      : null,
    business.websiteUrl
      ? { label: "Website", value: business.websiteUrl, href: business.websiteUrl }
      : null,
    business.instagramUrl
      ? { label: "Instagram", value: business.instagramUrl, href: business.instagramUrl }
      : null,
    business.email
      ? { label: "E-mail", value: business.email, href: `mailto:${business.email}` }
      : null
  ].filter(
    (contact): contact is { label: string; value: string; href: string } => contact !== null
  );

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
        {business.logoUrl ? (
          <Image
            className="business-logo"
            src={business.logoUrl}
            alt={`Logo de ${business.name}`}
            width={240}
            height={160}
          />
        ) : null}
        <span className="eyebrow">Empresa local</span>
        <h1>{business.name}</h1>
        {business.premium ? <span className="premium-badge">Premium</span> : null}
        {business.shortDescription ? <p className="muted">{business.shortDescription}</p> : null}
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
            {business.description ? <p>{business.description}</p> : null}
          </article>
          {business.gallery.length ? (
            <article className="panel">
              <h2>Galeria</h2>
              <div className="gallery-grid">
                {business.gallery.map((image) => (
                  <Image key={image.id} src={image.url} alt={image.alt} width={640} height={480} />
                ))}
              </div>
            </article>
          ) : null}
          {business.items.length ? (
            <article className="panel">
              <h2>Itens</h2>
              <div className="stack">
                {business.items.map((item) => (
                  <div className="business-item" key={item.id}>
                    {item.image ? <Image src={item.image} alt="" width={240} height={180} /> : null}
                    <h3>{item.title}</h3>
                    {item.description ? <p>{item.description}</p> : null}
                    {item.price !== undefined ? (
                      <p className="price">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL"
                        }).format(item.price)}
                      </p>
                    ) : null}
                    {item.ctaLabel && item.ctaUrl ? (
                      <a className="button secondary" href={item.ctaUrl}>
                        {item.ctaLabel}
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          ) : null}
        </div>
        <aside className="stack">
          {contacts.length > 0 ? (
            <div className="panel">
              <h2>Contatos</h2>
              {contacts.map((contact) => (
                <p key={contact.label}>
                  <a href={contact.href} target="_blank" rel="noreferrer">
                    <strong>{contact.label}:</strong> {contact.value}
                  </a>
                </p>
              ))}
            </div>
          ) : null}
          <div className="panel">
            <h2>Localização</h2>
            {business.addressLine || business.neighborhood || business.city ? (
              <p>
                {business.addressLine ? `${business.addressLine}, ` : ""}
                {business.neighborhood ? `${business.neighborhood}, ` : ""}
                {business.city} — RS
              </p>
            ) : null}
            {mapEmbedUrl ? (
              <iframe
                className="map-embed"
                src={mapEmbedUrl}
                title={`Mapa de ${business.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : null}
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
