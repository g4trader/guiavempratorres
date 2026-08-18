import Link from "next/link";
import type { Business } from "@/lib/domain";
import { RatingStars } from "@/components/business/RatingStars";
import { BusinessCardImage } from "@/components/media/BusinessCardImage";

export function BusinessCard({ business }: { business: Business }) {
  return (
    <article className="card business-card clickable-card">
      <Link
        className="card-cover-link"
        href={`/empresas/${business.slug}`}
        aria-label={`Ver empresa ${business.name}`}
      />
      <BusinessCardImage src={business.imageUrl} alt={business.imageAlt} />
      <div className="card-body">
        {business.premium ? <span className="premium-badge">Premium</span> : null}
        <h3>{business.name}</h3>
        <div
          className="business-card-rating"
          aria-label={`${business.ratingAverage.toFixed(1)} de 5 estrelas, ${business.ratingCount} ${
            business.ratingCount === 1 ? "avaliação" : "avaliações"
          }`}
        >
          <strong>{business.ratingAverage.toFixed(1).replace(".", ",")}</strong>
          <RatingStars
            value={business.ratingAverage}
            label={`${business.ratingAverage.toFixed(1)} de 5 estrelas`}
          />
          {business.ratingCount > 0 ? <span>({business.ratingCount})</span> : null}
        </div>
        {business.shortDescription ? (
          <p className="business-card-description">{business.shortDescription}</p>
        ) : null}
        {[business.neighborhood, business.city].filter(Boolean).length ? (
          <p className="business-card-location">
            {[business.neighborhood, business.city].filter(Boolean).join(", ")}
          </p>
        ) : null}
      </div>
    </article>
  );
}
