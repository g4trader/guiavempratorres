"use client";

import { useState, useTransition } from "react";
import { deleteGalleryImage, reorderGalleryImages } from "@/app/admin/content-actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { GalleryImage } from "@/components/media/GalleryImage";

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
};

export function SortableGallery({ businessId, initialImages }: { businessId: string; initialImages: GalleryItem[] }) {
  const [images, setImages] = useState(initialImages);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  function persistOrder(orderedImages: GalleryItem[]) {
    setDraggedId(null);
    setImages(orderedImages);
    startTransition(async () => {
      setStatus("Salvando nova ordem…");
      const result = await reorderGalleryImages(businessId, orderedImages.map((image) => image.id));
      setStatus(result.ok ? "Ordem da galeria salva." : result.message);
    });
  }

  return (
    <div className={`gallery-admin-sortable${isPending ? " is-saving" : ""}`}>
      <p className="gallery-sort-instruction">Arraste as imagens para definir a ordem de exibição.</p>
      <div className="gallery-admin-grid">
        {images.map((image) => (
          <div
            className={`gallery-admin-item${draggedId === image.id ? " is-dragging" : ""}`}
            key={image.id}
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (!draggedId || draggedId === image.id) return setDraggedId(null);
              const from = images.findIndex((item) => item.id === draggedId);
              const to = images.findIndex((item) => item.id === image.id);
              if (from < 0 || to < 0) return setDraggedId(null);
              const reordered = [...images];
              const [moved] = reordered.splice(from, 1);
              reordered.splice(to, 0, moved);
              persistOrder(reordered);
            }}
          >
            <span
              className="gallery-drag-handle"
              draggable
              role="button"
              tabIndex={0}
              aria-label={`Arrastar ${image.alt} para alterar sua posição`}
              title="Arraste para ordenar"
              onDragStart={(event) => {
                setDraggedId(image.id);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", image.id);
              }}
              onDragEnd={() => setDraggedId(null)}
            >
              <span aria-hidden="true">⠿</span> Arrastar
            </span>
            <GalleryImage src={image.src} alt={image.alt} />
            <span className="gallery-admin-caption">{image.alt}</span>
            <form action={deleteGalleryImage}>
              <input type="hidden" name="id" value={image.id} />
              <ConfirmSubmitButton message="Remover esta imagem da galeria?">
                Remover
              </ConfirmSubmitButton>
            </form>
          </div>
        ))}
      </div>
      <span className="gallery-sort-status" aria-live="polite">{status}</span>
    </div>
  );
}
