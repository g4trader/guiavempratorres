"use client";

import { useEffect, useState } from "react";
import type { HeroCampaign } from "@/lib/data/directory";
import { HeroImage } from "@/components/media/HeroImage";

export function HeroCarousel({ campaigns }: { campaigns: HeroCampaign[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (campaigns.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % campaigns.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [campaigns.length]);

  if (campaigns.length === 0) return null;

  const active = campaigns[activeIndex];
  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + campaigns.length) % campaigns.length);
  };

  return (
    <section
      className="hero-carousel"
      aria-roledescription="carrossel"
      aria-label="Empresas em destaque"
    >
      <div className="hero-stage">
        <a
          className="hero-banner-link"
          href={active.destinationUrl}
          target={active.isExternal ? "_blank" : undefined}
          rel={active.isExternal ? "noopener noreferrer" : undefined}
          aria-label={`Abrir anúncio: ${active.imageAlt}`}
        >
          <HeroImage
            desktop={active.imageDesktop}
            mobile={active.imageMobile}
            alt={active.imageAlt}
            priority={activeIndex === 0}
          />
        </a>
        {campaigns.length > 1 ? (
          <div className="carousel-controls hero-banner-controls">
            <button
              className="carousel-arrow"
              type="button"
              onClick={() => move(-1)}
              aria-label="Destaque anterior"
            >
              ←
            </button>
            <div className="carousel-dots" aria-label="Selecionar destaque">
              {campaigns.map((campaign, index) => (
                <button
                  key={campaign.id}
                  type="button"
                  className="carousel-dot"
                aria-label={`Ir para banner ${index + 1}: ${campaign.imageAlt}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            <button
              className="carousel-arrow"
              type="button"
              onClick={() => move(1)}
              aria-label="Próximo destaque"
            >
              →
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
