"use client";

import { useRef, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type Bucket =
  | "category-images"
  | "business-logos"
  | "business-hero-images"
  | "business-gallery"
  | "product-service-images"
  | "ad-creatives";

export function ImageUpload({
  bucket,
  entityId,
  name,
  currentPath = null,
  label
}: {
  bucket: Bucket;
  entityId: string;
  name: string;
  currentPath?: string | null;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [path, setPath] = useState(currentPath ?? "");
  const [preview, setPreview] = useState(currentPath ? publicUrl(currentPath) : "");
  const [status, setStatus] = useState("");
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) {
      setStatus("Selecione uma imagem válida.");
      return;
    }
    setStatus("Enviando…");
    const client = createBrowserSupabaseClient();
    const {
      data: { user }
    } = await client.auth.getUser();
    if (!user) {
      setStatus("Sessão expirada.");
      return;
    }
    const extension = file.name.split(".").pop()?.toLowerCase().replace("jpeg", "jpg") ?? "jpg";
    const objectPath = `${entityId}/${user.id}/${crypto.randomUUID()}.${extension}`;
    const { error } = await client.storage.from(bucket).upload(objectPath, file, {
      cacheControl: "3600",
      upsert: false
    });
    if (error) {
      setStatus("Não foi possível enviar a imagem.");
      return;
    }
    const nextPath = `${bucket}/${objectPath}`;
    setPath(nextPath);
    setPreview(publicUrl(nextPath));
    setStatus("Imagem enviada. Salve o formulário.");
  }

  async function remove() {
    if (path.startsWith(`${bucket}/`)) {
      const client = createBrowserSupabaseClient();
      await client.storage.from(bucket).remove([path.slice(bucket.length + 1)]);
    }
    setPath("");
    setPreview("");
    setStatus("Imagem removida. Salve o formulário.");
  }

  return (
    <div className="image-upload">
      <input type="hidden" name={name} value={path} />
      <span className="image-upload-label">{label}</span>
      <button
        className={`upload-dropzone${dragging ? " dragging" : ""}`}
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files[0];
          if (file) void upload(file);
        }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Prévia da imagem" />
        ) : (
          <span>Arraste uma imagem ou clique para selecionar</span>
        )}
      </button>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      <div className="upload-actions">
        {preview ? (
          <>
            <button
              className="button secondary"
              type="button"
              onClick={() => inputRef.current?.click()}
            >
              Substituir
            </button>
            <button className="button danger" type="button" onClick={() => void remove()}>
              Remover
            </button>
          </>
        ) : null}
        <span aria-live="polite">{status}</span>
      </div>
    </div>
  );
}

function publicUrl(path: string) {
  if (path.startsWith("http") || path.startsWith("/")) return path;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url ? `${url}/storage/v1/object/public/${path}` : "";
}
