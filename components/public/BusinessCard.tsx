import Link from "next/link";
import type { Business } from "@/lib/domain";
import { InstagramIcon, MapPinIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";
import { BusinessCardImage } from "@/components/media/BusinessCardImage";

export function BusinessCard({ business }: { business: Business }) {
  const whatsappNumber = business.whatsapp?.replace(/\D/g, "") ?? "";
  const mapQuery =
    business.latitude !== null && business.longitude !== null
      ? `${business.latitude},${business.longitude}`
      : [business.addressLine, business.neighborhood, business.city].filter(Boolean).join(", ");
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

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
        <div className="business-card-actions">
          <Link className="button secondary" href={`/empresas/${business.slug}`}>
            Ver empresa
          </Link>
          <div className="business-card-links" aria-label={`Atalhos de ${business.name}`}>
            {whatsappNumber ? (
              <a
                className="business-card-link whatsapp"
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Falar com ${business.name} pelo WhatsApp`}
                title="WhatsApp"
              >
                <WhatsAppIcon />
              </a>
            ) : null}
            {business.instagramUrl ? (
              <a
                className="business-card-link instagram"
                href={business.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Ver ${business.name} no Instagram`}
                title="Instagram"
              >
                <InstagramIcon />
              </a>
            ) : null}
            <a
              className="business-card-link maps"
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Ver ${business.name} no Google Maps`}
              title="Google Maps"
            >
              <MapPinIcon />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
