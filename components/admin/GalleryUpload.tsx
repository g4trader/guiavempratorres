"use client";

import { useRef, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const maxBytes = 8 * 1024 * 1024;

type UploadedImage = {
  id: string;
  path: string;
  preview: string;
  alt: string;
  fileName: string;
};

export function GalleryUpload({ entityId }: { entityId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [status, setStatus] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function uploadFiles(files: File[]) {
    if (!files.length || uploading) return;

    const invalidType = files.find((file) => !acceptedTypes.includes(file.type));
    if (invalidType) {
      setStatus(`${invalidType.name}: formato inválido. Use JPG, PNG, WebP ou AVIF.`);
      return;
    }
    const oversized = files.find((file) => file.size > maxBytes);
    if (oversized) {
      setStatus(`${oversized.name}: arquivo muito pesado. O limite é 8 MB por imagem.`);
      return;
    }

    setUploading(true);
    setStatus(`Enviando ${files.length} ${files.length === 1 ? "imagem" : "imagens"}…`);
    const client = createBrowserSupabaseClient();
    const {
      data: { user }
    } = await client.auth.getUser();
    if (!user) {
      setStatus("Sessão expirada.");
      setUploading(false);
      return;
    }

    const uploaded: UploadedImage[] = [];
    const failures: string[] = [];
    for (const file of files) {
      const extension = file.name.split(".").pop()?.toLowerCase().replace("jpeg", "jpg") ?? "jpg";
      const objectPath = `${entityId}/${user.id}/${crypto.randomUUID()}.${extension}`;
      const { error } = await client.storage.from("business-gallery").upload(objectPath, file, {
        cacheControl: "3600",
        upsert: false
      });
      if (error) {
        failures.push(file.name);
        continue;
      }
      const path = `business-gallery/${objectPath}`;
      uploaded.push({
        id: crypto.randomUUID(),
        path,
        preview: publicUrl(path),
        alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
        fileName: file.name
      });
    }

    setImages((current) => [...current, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    setStatus(
      failures.length
        ? `${uploaded.length} enviada(s). Falha em: ${failures.join(", ")}.`
        : `${uploaded.length} ${uploaded.length === 1 ? "imagem enviada" : "imagens enviadas"}. Revise os textos alternativos e salve.`
    );
  }

  async function removeImage(image: UploadedImage) {
    const client = createBrowserSupabaseClient();
    const { error } = await client.storage
      .from("business-gallery")
      .remove([image.path.slice("business-gallery/".length)]);
    if (error) {
      setStatus(`Não foi possível remover ${image.fileName}.`);
      return;
    }
    setImages((current) => current.filter((item) => item.id !== image.id));
    setStatus("Imagem removida do lote.");
  }

  return (
    <div className="image-upload gallery-batch-upload">
      <span className="image-upload-label">Novas imagens da galeria</span>
      <button
        className={`upload-dropzone gallery-dropzone${dragging ? " dragging" : ""}`}
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void uploadFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <strong>{uploading ? "Enviando imagens…" : "Arraste várias imagens para esta área"}</strong>
        <span>ou clique para selecionar um grupo de arquivos</span>
        <small>JPG, PNG, WebP ou AVIF · até 8 MB por imagem</small>
      </button>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={(event) => void uploadFiles(Array.from(event.target.files ?? []))}
      />
      {images.length ? (
        <div className="gallery-upload-previews">
          {images.map((image) => (
            <div className="gallery-upload-preview" key={image.id}>
              <input type="hidden" name="storage_path" value={image.path} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.preview} alt="" />
              <label>
                Texto alternativo
                <input
                  name="image_alt"
                  required
                  value={image.alt}
                  onChange={(event) =>
                    setImages((current) =>
                      current.map((item) =>
                        item.id === image.id ? { ...item, alt: event.target.value } : item
                      )
                    )
                  }
                />
              </label>
              <button className="button danger" type="button" onClick={() => void removeImage(image)}>
                Remover
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <span aria-live="polite">{status}</span>
    </div>
  );
}

function publicUrl(path: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url ? `${url}/storage/v1/object/public/${path}` : "";
}
