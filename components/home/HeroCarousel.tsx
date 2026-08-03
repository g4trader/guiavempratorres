"use client";

import { useEffect, useState } from "react";
import type { HeroCampaign } from "@/lib/data/directory";
import { HeroImage } from "@/components/media/HeroImage";

export function HeroCarousel({ campaigns }: { campaigns: HeroCampaign[] }) {
  const [slides, setSlides] = useState({ active: 0, previous: null as number | null, revision: 0 });

  useEffect(() => {
    if (campaigns.length < 2) return;
    const timer = window.setInterval(() => {
      setSlides((current) => ({
        active: (current.active + 1) % campaigns.length,
        previous: current.active,
        revision: current.revision + 1
      }));
    }, 7000);
    return () => window.clearInterval(timer);
  }, [campaigns.length]);

  useEffect(() => {
    if (slides.previous === null) return;
    const timer = window.setTimeout(() => {
      setSlides((current) =>
        current.revision === slides.revision ? { ...current, previous: null } : current
      );
    }, 700);
    return () => window.clearTimeout(timer);
  }, [slides.previous, slides.revision]);

  if (campaigns.length === 0) return null;

  const active = campaigns[slides.active] ?? campaigns[0];
  const previous = slides.previous === null ? null : campaigns[slides.previous];

  function showSlide(index: number) {
    setSlides((current) =>
      index === current.active
        ? current
        : { active: index, previous: current.active, revision: current.revision + 1 }
    );
  }

  return (
    <section
      className="hero-carousel"
      aria-roledescription="carrossel"
      aria-label="Empresas em destaque"
    >
      <div className="hero-stage">
        {previous ? (
          <div className="hero-slide hero-slide-previous" aria-hidden="true">
            <HeroImage
              desktop={previous.imageDesktop}
              mobile={previous.imageMobile}
              alt=""
            />
          </div>
        ) : null}
        <div
          className={`hero-slide hero-slide-current${previous ? " is-transitioning" : ""}`}
          key={`${active.id}-${slides.revision}`}
        >
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
              priority={slides.revision === 0}
            />
          </a>
        </div>
        {campaigns.length > 1 ? (
          <div className="carousel-dots hero-banner-pagination" aria-label="Banner atual">
            {campaigns.map((campaign, index) => (
              <button
                key={campaign.id}
                type="button"
                className="carousel-dot"
                aria-label={`Ir para banner ${index + 1}: ${campaign.imageAlt}`}
                aria-current={index === slides.active ? "true" : undefined}
                onClick={() => showSlide(index)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
