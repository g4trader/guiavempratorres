"use client";

import { useEffect, useId, useRef, useState } from "react";
import { uploadMedia } from "@/lib/data/media";
import { imagePlacement, type ImageFit } from "@/lib/media/image-layout";

type Bucket =
  | "category-images"
  | "business-logos"
  | "business-hero-images"
  | "business-gallery"
  | "product-service-images"
  | "ad-creatives"
  | "tourist-attraction-images";
const recommendedSizes: Record<Bucket, string> = {
  "category-images": "1200 × 900 px",
  "business-logos": "1200 px no lado maior",
  "business-hero-images": "1600 × 1200 px",
  "business-gallery": "1600 × 1200 px",
  "product-service-images": "1200 × 900 px",
  "ad-creatives": "1600 × 1200 px",
  "tourist-attraction-images": "1600 × 1200 px"
};
const types = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/svg+xml": "svg"
};
type Selection = { file: File; url: string; image: HTMLImageElement };

export function ImageUpload({
  bucket,
  entityId,
  name,
  currentPath = null,
  label,
  demonstration = false,
  onPreviewChange,
  onPathChange,
  recommendedDimensions
}: {
  bucket: Bucket;
  entityId: string;
  name: string;
  currentPath?: string | null;
  label: string;
  demonstration?: boolean;
  onPreviewChange?: (url: string) => void;
  onPathChange?: (path: string) => void;
  recommendedDimensions?: string;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const urls = useRef(new Set<string>());
  const busyRef = useRef(false);
  const [path, setPath] = useState(currentPath ?? "");
  const [preview, setPreview] = useState(currentPath ? publicUrl(currentPath) : "");
  const [original, setOriginal] = useState<Selection | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [fit, setFit] = useState<ImageFit>("cover");
  const [zoom, setZoom] = useState(1);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [dragging, setDragging] = useState(false);
  const logo = bucket === "business-logos";
  const acceptedTypes = logo ? [...types, "image/svg+xml"] : types;
  const maxBytes =
    (logo ? 2 : bucket === "category-images" || bucket === "product-service-images" ? 5 : 8) *
    1024 *
    1024;

  useEffect(() => {
    onPreviewChange?.(preview);
  }, [preview, onPreviewChange]);

  useEffect(() => {
    const ownedUrls = urls.current;
    return () => {
      ownedUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Capture submission before React server actions, including submission by Enter.
  useEffect(() => {
    const form = rootRef.current?.closest("form");
    function guard(event: Event) {
      if (!busyRef.current && !selection) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setStatus(
        busyRef.current
          ? "Aguarde o envio da imagem antes de salvar."
          : "Aplique ou cancele o ajuste da imagem antes de salvar."
      );
      rootRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    form?.addEventListener("submit", guard, true);
    return () => form?.removeEventListener("submit", guard, true);
  }, [selection]);

  useEffect(() => {
    if (!selection || logo) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const rect = imagePlacement(
      selection.image.naturalWidth,
      selection.image.naturalHeight,
      canvas.width,
      canvas.height,
      fit,
      zoom,
      x,
      y
    );
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(selection.image, rect.x, rect.y, rect.width, rect.height);
  }, [selection, fit, zoom, x, y, logo]);

  function objectUrl(blob: Blob) {
    const url = URL.createObjectURL(blob);
    urls.current.add(url);
    return url;
  }

  async function select(file: File) {
    if (busyRef.current) return;
    if (!acceptedTypes.includes(file.type)) {
      setStatus(`Formato inválido. Use JPG, PNG, WebP, AVIF${logo ? " ou SVG" : ""}.`);
      return;
    }
    if (file.size > (logo ? maxBytes : 25 * 1024 * 1024)) {
      setStatus(`Arquivo muito pesado. O limite de entrada é ${logo ? 2 : 25} MB.`);
      return;
    }
    busyRef.current = true;
    setBusy(true);
    setStatus("Preparando prévia…");
    const url = objectUrl(file);
    try {
      const image = new window.Image();
      image.src = url;
      await image.decode();
      if (
        !image.naturalWidth ||
        !image.naturalHeight ||
        image.naturalWidth * image.naturalHeight > 60_000_000
      )
        throw new Error("dimensions");
      setSelection({ file, url, image });
      setFit(
        logo || bucket === "ad-creatives" || bucket === "product-service-images"
          ? "contain"
          : "cover"
      );
      setZoom(1);
      setX(50);
      setY(50);
      setStatus("");
    } catch {
      URL.revokeObjectURL(url);
      urls.current.delete(url);
      setStatus("Não foi possível abrir esta imagem. Use outro arquivo com até 60 megapixels.");
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  async function apply() {
    if (!selection || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setStatus("Preparando imagem…");
    try {
      let file = selection.file;
      if (!logo) {
        // Avoid upscaling the original, including when zooming into a crop.
        const scale = imagePlacement(
          selection.image.naturalWidth,
          selection.image.naturalHeight,
          1600,
          1200,
          fit,
          zoom,
          x,
          y
        ).scale;
        const width = Math.max(4, Math.floor(1600 / Math.max(1, scale) / 4) * 4);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = (width * 3) / 4;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("canvas");
        const rect = imagePlacement(
          selection.image.naturalWidth,
          selection.image.naturalHeight,
          canvas.width,
          canvas.height,
          fit,
          zoom,
          x,
          y
        );
        context.drawImage(selection.image, rect.x, rect.y, rect.width, rect.height);
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/webp", 0.88)
        );
        if (!blob) throw new Error("encoding");
        file = new File([blob], `imagem.${extensions[blob.type] ?? "png"}`, { type: blob.type });
      }
      if (file.size > maxBytes) {
        setStatus(
          `A imagem preparada ultrapassa ${maxBytes / 1024 / 1024} MB. Escolha um arquivo menor.`
        );
        return;
      }
      if (demonstration) {
        setOriginal(selection);
        setPreview(objectUrl(file));
        setSelection(null);
        setStatus("Prévia aplicada. Modo demonstrativo: nenhum arquivo foi enviado.");
        return;
      }
      setStatus("Enviando…");
      const nextPath = await uploadMedia(bucket, entityId, file, extensions[file.type]);
      setOriginal(selection);
      setPath(nextPath);
      onPathChange?.(nextPath);
      setPreview(publicUrl(nextPath));
      setSelection(null);
      setStatus("Imagem enviada. Salve o formulário.");
    } catch (error) {
      setStatus(
        error instanceof Error && error.message === "SESSION_EXPIRED"
          ? "Sessão expirada. Entre novamente para enviar a imagem."
          : "Não foi possível enviar a imagem. Seu ajuste foi mantido; tente novamente."
      );
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  async function sample() {
    const image = new window.Image();
    image.src = "/placeholders/hero-desktop.svg";
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext("2d")?.drawImage(image, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (blob) await select(new File([blob], "exemplo.png", { type: "image/png" }));
  }

  const lowResolution =
    selection &&
    !logo &&
    imagePlacement(
      selection.image.naturalWidth,
      selection.image.naturalHeight,
      1000,
      750,
      fit,
      zoom,
      x,
      y
    ).scale > 1;

  return (
    <div className="image-upload" ref={rootRef} aria-busy={busy}>
      <input type="hidden" name={name} value={path} />
      <div className="image-upload-heading">
        <span className="image-upload-label" id={`${id}-label`}>
          {label}
        </span>
        <span className="image-ratio-badge">{logo ? "Marca inteira" : "4:3"}</span>
      </div>
      <p className="field-hint" id={`${id}-hint`}>
        {logo
          ? "Envie o logo original. Proporção e transparência serão preservadas, sem recortes."
          : "Envie a imagem original. Ajuste aqui, sem preparar versões em outro editor."}
      </p>
      <p className="field-hint" id={`${id}-dimensions`}>
        <strong>Recomendado: {recommendedDimensions ?? recommendedSizes[bucket]}.</strong>{" "}
        {logo
          ? "Mantenha a proporção original. Para SVG, não há tamanho obrigatório em pixels."
          : "Largura × altura · proporção 4:3. Outros tamanhos são aceitos e podem ser ajustados aqui."}
      </p>
      {!selection ? (
        <button
          className={`upload-dropzone image-upload-stage${dragging ? " dragging" : ""}${logo ? " logo-stage" : ""}`}
          type="button"
          disabled={busy}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-hint ${id}-dimensions`}
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
            if (file) void select(file);
          }}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={`Prévia: ${label}`} />
          ) : (
            <span>
              <strong>＋ Selecionar imagem</strong>
              <small>ou arraste o arquivo até aqui</small>
              <small>
                {logo
                  ? "Até 2 MB · SVG, PNG, JPG, WebP ou AVIF"
                  : "Até 25 MB · JPG, PNG, WebP ou AVIF"}
              </small>
            </span>
          )}
        </button>
      ) : (
        <div className="image-editor">
          <div className={`image-upload-stage${logo ? " logo-stage" : ""}`}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selection.url} alt="Logo completo, sem recortes" />
            ) : (
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                role="img"
                aria-label="Prévia do enquadramento"
              />
            )}
          </div>
          <p className="field-hint">
            Original: {selection.image.naturalWidth} × {selection.image.naturalHeight} px.{" "}
            {logo
              ? "Sem alteração do arquivo."
              : "A prévia mostra o enquadramento que será aplicado."}
          </p>
          {!logo && (
            <fieldset className="image-fit-options" disabled={busy}>
              <legend>Como exibir</legend>
              <label>
                <input
                  type="radio"
                  name={`${id}-fit`}
                  checked={fit === "cover"}
                  onChange={() => setFit("cover")}
                />
                Preencher com recorte
              </label>
              <label>
                <input
                  type="radio"
                  name={`${id}-fit`}
                  checked={fit === "contain"}
                  onChange={() => setFit("contain")}
                />
                Mostrar imagem inteira
              </label>
            </fieldset>
          )}
          {!logo && fit === "cover" ? (
            <div className="image-adjustments">
              <label>
                Zoom{" "}
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  disabled={busy}
                  onChange={(event) => setZoom(Number(event.target.value))}
                />
              </label>
              <label>
                Posição horizontal{" "}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={x}
                  disabled={busy}
                  onChange={(event) => setX(Number(event.target.value))}
                />
              </label>
              <label>
                Posição vertical{" "}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={y}
                  disabled={busy}
                  onChange={(event) => setY(Number(event.target.value))}
                />
              </label>
            </div>
          ) : !logo ? (
            <p className="field-hint">
              Ideal para artes com texto e produtos: todo o conteúdo fica visível. Pode haver espaço
              livre nas bordas.
            </p>
          ) : null}
          {lowResolution ? (
            <p className="image-quality-note" role="status">
              Esta imagem pode perder nitidez em telas grandes. Prefira um original maior ou reduza
              o zoom.
            </p>
          ) : null}
          <div className="upload-actions">
            <button className="button" type="button" disabled={busy} onClick={() => void apply()}>
              {busy ? "Preparando…" : "Aplicar imagem"}
            </button>
            <button
              className="button secondary"
              type="button"
              disabled={busy}
              onClick={() => {
                setSelection(null);
                setStatus("Ajuste cancelado. A imagem anterior foi mantida.");
              }}
            >
              Cancelar ajuste
            </button>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        aria-label={`Selecionar arquivo: ${label}`}
        aria-describedby={`${id}-hint ${id}-dimensions`}
        disabled={busy}
        accept={acceptedTypes.join(",")}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void select(file);
        }}
      />
      <div className="upload-actions">
        {demonstration && !selection && (
          <button
            className="button secondary"
            type="button"
            disabled={busy}
            onClick={() => void sample()}
          >
            Experimentar com exemplo
          </button>
        )}
        {original && preview && !selection && (
          <button
            className="button secondary"
            type="button"
            disabled={busy}
            onClick={() => setSelection(original)}
          >
            Ajustar novamente
          </button>
        )}
        {preview && !selection ? (
          <>
            <button
              className="button secondary"
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              Substituir
            </button>
            <button
              className="button danger"
              type="button"
              disabled={busy}
              onClick={() => {
                setPath("");
                onPathChange?.("");
                setPreview("");
                setStatus("Remoção pendente. Salve o formulário para confirmar.");
              }}
            >
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
