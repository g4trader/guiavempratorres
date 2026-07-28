"use client";

import { useState } from "react";
import type { HeroCampaign } from "@/lib/data/directory";
import { HeroImage } from "@/components/media/HeroImage";

export function HeroCarousel({ campaigns }: { campaigns: HeroCampaign[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (campaigns.length === 0) {
    return (
      <div className="hero-stage hero-empty">
        <div className="hero-copy">
          <span className="eyebrow">Novidades locais</span>
          <h1>Em breve, novos destaques por aqui.</h1>
          <p className="muted">Nenhuma campanha está ativa neste momento.</p>
        </div>
      </div>
    );
  }

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
        <HeroImage
          desktop={active.imageDesktop}
          mobile={active.imageMobile}
          alt={active.imageAlt}
          priority={activeIndex === 0}
        />
        <div className="hero-overlay" />
        <div className="hero-copy container" aria-live="polite">
          <span className="eyebrow">Destaque local · {active.businessName}</span>
          <h1>{active.title}</h1>
          <p>{active.description}</p>
          <a className="button" href={active.internalPath}>
            Conhecer empresa
          </a>
        </div>
      </div>
      {campaigns.length > 1 ? (
        <div className="carousel-controls">
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
                aria-label={`Ir para destaque ${index + 1}: ${campaign.businessName}`}
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
    </section>
  );
}
