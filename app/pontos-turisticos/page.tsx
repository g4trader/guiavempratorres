import type { Metadata } from "next";
import Link from "next/link";
import { CategoryImage } from "@/components/media/CategoryImage";
import { listPublishedTouristAttractions } from "@/lib/data/tourist-attractions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Pontos turísticos em Torres",
  description: "Conheça os principais pontos turísticos de Torres e planeje seu passeio."
};

export default async function TouristAttractionsPage() {
  const attractions = await listPublishedTouristAttractions();
  return (
    <div className="container section tourist-attractions-listing">
      <header className="page-header">
        <span className="eyebrow">Explore Torres</span>
        <h1>Pontos turísticos</h1>
        <p className="muted">
          Descubra lugares que fazem parte da paisagem e da história de Torres.
        </p>
      </header>
      {attractions.length ? (
        <div className="grid category-grid">
          {attractions.map((attraction) => (
            <article className="card category-card clickable-card" key={attraction.id}>
              <Link
                className="card-cover-link"
                href={`/pontos-turisticos/${attraction.slug}`}
                aria-label={`Conhecer ${attraction.title}`}
              />
              <CategoryImage src={attraction.cardImageUrl} alt={attraction.cardImageAlt} />
              <div className="card-body">
                <h2>{attraction.title}</h2>
                {attraction.excerpt ? <p>{attraction.excerpt}</p> : null}
                <span className="button secondary card-visual-cta" aria-hidden="true">
                  Conhecer
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty">Nenhum ponto turístico publicado.</div>
      )}
    </div>
  );
}
