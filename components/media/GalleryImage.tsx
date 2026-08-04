"use client";

import Image from "next/image";
import { useRef } from "react";

export function GalleryImage({ src, alt }: { src: string; alt: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <figure className="gallery-image-frame">
        <button
          className="gallery-image-trigger"
          type="button"
          aria-label={`Ampliar imagem: ${alt}`}
          onClick={() => dialogRef.current?.showModal()}
        >
          <Image
            src={src}
            alt={alt}
            width={900}
            height={675}
            sizes="(max-width: 700px) 100vw, 50vw"
          />
          <span className="gallery-expand-hint" aria-hidden="true">⌕</span>
        </button>
      </figure>
      <dialog
        ref={dialogRef}
        className="gallery-lightbox"
        aria-label={`Visualização ampliada: ${alt}`}
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
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={1200}
          sizes="95vw"
          priority={false}
        />
        <p>{alt}</p>
      </dialog>
    </>
  );
}
