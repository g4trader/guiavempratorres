import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TouristAttractionCarousel } from "@/components/tourist-attractions/TouristAttractionCarousel";
import { FormattedText } from "@/components/public/FormattedText";
import { getPublishedTouristAttractionBySlug } from "@/lib/data/tourist-attractions";
import { resolvePublicAsset } from "@/lib/data/directory";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const attraction = await getPublishedTouristAttractionBySlug((await params).slug);
  if (!attraction) return {};
  return {
    title: attraction.seoTitle ?? attraction.title,
    description: attraction.seoDescription ?? attraction.excerpt,
    alternates: { canonical: `/pontos-turisticos/${attraction.slug}` },
    openGraph: {
      title: attraction.title,
      description: attraction.excerpt,
      images: [{ url: attraction.cardImageUrl, alt: attraction.cardImageAlt }]
    }
  };
}

export default async function TouristAttractionPage({ params }: Props) {
  const attraction = await getPublishedTouristAttractionBySlug((await params).slug);
  if (!attraction) notFound();
  const mapEmbedUrl =
    attraction.latitude !== null && attraction.longitude !== null
      ? `https://www.google.com/maps?q=${attraction.latitude},${attraction.longitude}&z=15&output=embed`
      : null;
  const galleryImages = attraction.contentBlocks.flatMap((block) => {
    if (block.type !== "IMAGE") return [];
    const url = resolvePublicAsset(block.imagePath);
    return url
      ? [{ id: block.id, url, alt: block.imageAlt || `Imagem de ${attraction.title}` }]
      : [];
  });
  const textBlocks = attraction.contentBlocks.filter((block) => block.type !== "IMAGE");

  return (
    <article className="container section tourist-attraction-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Início</Link> / <Link href="/pontos-turisticos">Pontos turísticos</Link> /{" "}
        {attraction.title}
      </nav>
      <header className="page-header">
        <span className="eyebrow">Ponto turístico</span>
        <h1>{attraction.title}</h1>
        {attraction.excerpt ? (
          <FormattedText
            value={attraction.excerpt}
            className="muted tourist-attraction-description"
          />
        ) : null}
      </header>
      <div className="tourist-content-blocks">
        {textBlocks.map((block) => {
          if (block.type === "H1") return <h1 key={block.id}>{block.text}</h1>;
          if (block.type === "H2") return <h2 key={block.id}>{block.text}</h2>;
          if (block.type === "PARAGRAPH") return <p key={block.id}>{block.text}</p>;
          return null;
        })}
      </div>
      <TouristAttractionCarousel images={galleryImages} attractionTitle={attraction.title} />
      <section className="tourist-location" aria-labelledby="localizacao-ponto">
        <h2 id="localizacao-ponto">Localização</h2>
        {mapEmbedUrl ? (
          <iframe
            src={mapEmbedUrl}
            title={`Mapa de ${attraction.title}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : null}
        <p>
          {[
            attraction.addressLine,
            attraction.neighborhood,
            attraction.city,
            attraction.state,
            attraction.postalCode
          ]
            .filter(Boolean)
            .join(", ")}
        </p>
        {attraction.googleMapsUrl ? (
          <a
            className="button secondary"
            href={attraction.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            Abrir no Google Maps
          </a>
        ) : null}
      </section>
    </article>
  );
}
