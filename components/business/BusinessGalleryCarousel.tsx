"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type CarouselImage = { id: string; url: string; alt: string };

export function BusinessGalleryCarousel({ images }: { images: CarouselImage[] }) {
  const [active, setActive] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const current = images[active];

  if (!current) return null;

  function move(direction: -1 | 1) {
    setActive((index) => (index + direction + images.length) % images.length);
  }

  return (
    <section className="business-gallery-carousel" aria-label="Imagens da empresa">
      <button className="business-gallery-image" type="button" aria-label={`Ampliar imagem: ${current.alt}`} onClick={() => dialogRef.current?.showModal()}>
        <Image src={current.url} alt={current.alt} fill priority={active === 0} sizes="(max-width: 700px) 100vw, 1200px" />
      </button>
      {images.length > 1 ? (
        <>
          <button className="business-gallery-arrow previous" type="button" onClick={() => move(-1)} aria-label="Imagem anterior">←</button>
          <button className="business-gallery-arrow next" type="button" onClick={() => move(1)} aria-label="Próxima imagem">→</button>
          <div className="business-gallery-dots" aria-label="Selecionar imagem">
            {images.map((image, index) => (
              <button className={index === active ? "is-active" : ""} type="button" key={image.id} aria-label={`Exibir imagem ${index + 1}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)} />
            ))}
          </div>
        </>
      ) : null}
      <dialog ref={dialogRef} className="gallery-lightbox" aria-label={`Visualização ampliada: ${current.alt}`} onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}>
        <button className="gallery-lightbox-close" type="button" aria-label="Fechar imagem ampliada" onClick={() => dialogRef.current?.close()}>×</button>
        <Image src={current.url} alt={current.alt} width={1600} height={1200} sizes="95vw" />
        <p>{current.alt}</p>
      </dialog>
    </section>
  );
}
