import Link from "next/link";
import type { Business } from "@/lib/domain";
import { BusinessCardImage } from "@/components/media/BusinessCardImage";

export function BusinessCard({ business }: { business: Business }) {
  return (
    <article className="card business-card">
      <BusinessCardImage src={business.imageUrl} alt={business.imageAlt} />
      <div className="card-body">
        {business.premium ? <span className="premium-badge">Premium</span> : null}
        <h3>{business.name}</h3>
        {business.shortDescription ? <p>{business.shortDescription}</p> : null}
        {[business.neighborhood, business.city].filter(Boolean).length ? (
          <p>{[business.neighborhood, business.city].filter(Boolean).join(", ")}</p>
        ) : null}
        <Link className="button secondary" href={`/empresas/${business.slug}`}>
          Ver empresa
        </Link>
      </div>
    </article>
  );
}
