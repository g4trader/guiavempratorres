"use client";

import { useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { BusinessCardImage } from "@/components/media/BusinessCardImage";
import { GalleryImage } from "@/components/media/GalleryImage";
import { HeroImage } from "@/components/media/HeroImage";

const modes = [
  {
    label: "Foto da empresa",
    bucket: "business-hero-images",
    description: "Uma foto para o card, a capa e a galeria."
  },
  {
    label: "Banner de campanha",
    bucket: "ad-creatives",
    description: "A mesma arte no computador e no celular, sem cortar textos."
  },
  {
    label: "Logo",
    bucket: "business-logos",
    description: "Sua marca inteira, com a proporção original preservada."
  }
] as const;

export function ImageUploadDemo() {
  const [mode, setMode] = useState(0);
  const [preview, setPreview] = useState("");
  const [saved, setSaved] = useState(false);
  const current = modes[mode];
  return (
    <>
      <div className="image-demo-tabs" role="group" aria-label="Tipo de imagem">
        {modes.map((item, index) => (
          <button
            type="button"
            key={item.bucket}
            aria-pressed={mode === index}
            onClick={() => {
              setMode(index);
              setPreview("");
              setSaved(false);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="image-demo-layout">
        <form
          className="panel admin-form image-demo-form"
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(true);
          }}
        >
          <div>
            <span className="eyebrow">01 · No cadastro</span>
            <h2>Envie. Ajuste. Pronto.</h2>
            <p>{current.description}</p>
          </div>
          <ImageUpload
            key={current.bucket}
            bucket={current.bucket}
            entityId="demonstracao"
            name="demo_image"
            label={current.label}
            demonstration
            onPreviewChange={setPreview}
          />
          <button className="button" type="submit">
            Simular salvar cadastro
          </button>
          {saved && (
            <p role="status">Cadastro simulado. Nenhuma alteração foi enviada ao servidor.</p>
          )}
        </form>
        <section className="image-demo-result" aria-label="Resultado no site">
          <span className="eyebrow">02 · No site</span>
          <h2>Veja o resultado</h2>
          <p>Aplique a imagem para conferir nos componentes do site.</p>
          {!preview ? (
            <div className="image-demo-empty">
              <span aria-hidden="true">▧</span>
              <strong>Sua imagem aparece aqui</strong>
              <p>Escolha um arquivo ou experimente com o exemplo.</p>
            </div>
          ) : mode === 2 ? (
            <div className="panel">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="business-logo" src={preview} alt="Logo de demonstração" />
              <h3>Nome da sua empresa</h3>
              <p>Logo sem recortes ou distorções.</p>
            </div>
          ) : mode === 1 ? (
            <div className="image-demo-campaign">
              <HeroImage desktop={preview} alt="Campanha de demonstração" />
              <div className="panel">
                <span className="eyebrow">Destaque local</span>
                <h3>Uma boa imagem. Mais possibilidades.</h3>
                <p>Título e descrição ficam fora da arte e se adaptam à tela.</p>
              </div>
            </div>
          ) : (
            <>
              <article className="card image-demo-card">
                <BusinessCardImage src={preview} alt="Foto de demonstração" />
                <div className="card-body">
                  <span className="eyebrow">Seu próximo destino</span>
                  <h3>Nome da sua empresa</h3>
                  <p>Torres · Rio Grande do Sul</p>
                </div>
              </article>
              <details className="image-demo-more">
                <summary>Conferir também na capa e na galeria</summary>
                <div className="business-hero">
                  <HeroImage desktop={preview} alt="Capa de demonstração" />
                </div>
                <GalleryImage src={preview} alt="Galeria de demonstração" />
              </details>
            </>
          )}
        </section>
      </div>
    </>
  );
}
