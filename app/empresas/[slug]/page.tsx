import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedBusinessBySlug } from "@/lib/data/directory";
import { BusinessRating } from "@/components/business/BusinessRating";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";
import { GalleryImage } from "@/components/media/GalleryImage";
import { HeroImage } from "@/components/media/HeroImage";
import { createAuthenticatedServerClient } from "@/lib/supabase/auth-server";

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
  const authClient = await createAuthenticatedServerClient();
  const {
    data: { user }
  } = (await authClient?.auth.getUser()) ?? { data: { user: null } };
  const { data: userRating } =
    user && authClient
      ? await authClient
          .from("business_ratings")
          .select("rating")
          .eq("business_id", business.id)
          .eq("user_id", user.id)
          .maybeSingle()
      : { data: null };

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
    },
    aggregateRating:
      business.ratingCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: business.ratingAverage,
            ratingCount: business.ratingCount,
            bestRating: 5,
            worstRating: 1
          }
        : undefined
  };
  const contacts = [
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
      <header className="page-header business-header">
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
      <div className="business-hero">
        <HeroImage desktop={business.imageUrl} alt={business.imageAlt} priority />
      </div>
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
                  <GalleryImage key={image.id} src={image.url} alt={image.alt} />
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
          <BusinessRating
            business={business}
            currentRating={userRating?.rating ?? null}
          />
          {contacts.length > 0 || business.whatsapp || business.instagramUrl ? (
            <div className="panel">
              <h2>Contatos</h2>
              {business.whatsapp || business.instagramUrl ? (
                <div className="contact-ctas">
                  {business.whatsapp ? (
                    <a
                      className="social-cta whatsapp"
                      href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Falar com ${business.name} pelo WhatsApp`}
                    >
                      <WhatsAppIcon />
                      <span>Chamar no WhatsApp</span>
                    </a>
                  ) : null}
                  {business.instagramUrl ? (
                    <a
                      className="social-cta instagram"
                      href={business.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Ver ${business.name} no Instagram`}
                    >
                      <InstagramIcon />
                      <span>Ver no Instagram</span>
                    </a>
                  ) : null}
                </div>
              ) : null}
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
