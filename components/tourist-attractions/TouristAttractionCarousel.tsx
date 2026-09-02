"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type TouristImage = {
  id: string;
  url: string;
  alt: string;
};

export function TouristAttractionCarousel({
  images,
  attractionTitle
}: {
  images: TouristImage[];
  attractionTitle: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activeImage = images[activeIndex];

  if (!activeImage) return null;

  function move(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + images.length) % images.length);
  }

  return (
    <section className="tourist-gallery-carousel" aria-label={`Galeria de ${attractionTitle}`}>
      <button
        className="tourist-gallery-image"
        type="button"
        aria-label={`Ampliar imagem: ${activeImage.alt}`}
        onClick={() => dialogRef.current?.showModal()}
      >
        <Image
          src={activeImage.url}
          alt={activeImage.alt}
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 760px) 100vw, 760px"
        />
        <span className="tourist-gallery-zoom" aria-hidden="true">⌕</span>
      </button>

      {images.length > 1 ? (
        <>
          <button
            className="tourist-gallery-arrow previous"
            type="button"
            aria-label="Imagem anterior"
            onClick={() => move(-1)}
          >
            ←
          </button>
          <button
            className="tourist-gallery-arrow next"
            type="button"
            aria-label="Próxima imagem"
            onClick={() => move(1)}
          >
            →
          </button>
          <div className="tourist-gallery-dots" aria-label="Selecionar imagem">
            {images.map((image, index) => (
              <button
                className={index === activeIndex ? "is-active" : ""}
                type="button"
                key={image.id}
                aria-label={`Exibir imagem ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </>
      ) : null}

      <dialog
        ref={dialogRef}
        className="gallery-lightbox"
        aria-label={`Visualização ampliada: ${activeImage.alt}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <button
          className="gallery-lightbox-close"
          type="button"
          aria-label="Fechar imagem ampliada"
          onClick={() => dialogRef.current?.close()}
        >
          ×
        </button>
        <Image src={activeImage.url} alt={activeImage.alt} width={1600} height={1200} sizes="95vw" />
        <p>{activeImage.alt}</p>
      </dialog>
    </section>
  );
}
