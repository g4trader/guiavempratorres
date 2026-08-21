"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { TouristAttractionBlock } from "@/lib/domain";

const blockLabels = {
  H1: "Título (H1)",
  H2: "Subtítulo (H2)",
  IMAGE: "Imagem",
  PARAGRAPH: "Texto (parágrafo)"
} as const;

export function TouristAttractionBlockEditor({
  entityId,
  initialBlocks = []
}: {
  entityId: string;
  initialBlocks?: TouristAttractionBlock[];
}) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [choosing, setChoosing] = useState(false);

  function addBlock(type: TouristAttractionBlock["type"]) {
    const id = crypto.randomUUID();
    setBlocks((current) => [
      ...current,
      type === "IMAGE" ? { id, type, imagePath: "", imageAlt: "" } : { id, type, text: "" }
    ]);
    setChoosing(false);
  }

  function updateBlock(id: string, update: Partial<TouristAttractionBlock>) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === id ? ({ ...block, ...update } as TouristAttractionBlock) : block
      )
    );
  }

  function moveBlock(index: number, direction: -1 | 1) {
    setBlocks((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <fieldset className="block-editor">
      <legend>Conteúdo da página</legend>
      <input type="hidden" name="content_blocks" value={JSON.stringify(blocks)} />
      <div className="block-editor-list">
        {blocks.map((block, index) => (
          <section className="content-block-admin" key={block.id}>
            <div className="content-block-toolbar">
              <strong>{blockLabels[block.type]}</strong>
              <div>
                <button
                  type="button"
                  aria-label="Mover bloco para cima"
                  disabled={index === 0}
                  onClick={() => moveBlock(index, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Mover bloco para baixo"
                  disabled={index === blocks.length - 1}
                  onClick={() => moveBlock(index, 1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  aria-label="Remover bloco"
                  onClick={() =>
                    setBlocks((current) => current.filter(({ id }) => id !== block.id))
                  }
                >
                  ×
                </button>
              </div>
            </div>
            {block.type === "IMAGE" ? (
              <>
                <ImageUpload
                  bucket="tourist-attraction-images"
                  entityId={entityId}
                  name={`block_image_${block.id}`}
                  label="Imagem do bloco"
                  recommendedDimensions="1600 × 1200 px"
                  currentPath={block.imagePath}
                  onPathChange={(imagePath) => updateBlock(block.id, { imagePath })}
                />
                <label>
                  Texto alternativo
                  <input
                    value={block.imageAlt}
                    onChange={(event) => updateBlock(block.id, { imageAlt: event.target.value })}
                  />
                </label>
              </>
            ) : block.type === "PARAGRAPH" ? (
              <label>
                Parágrafo
                <textarea
                  rows={5}
                  value={block.text}
                  onChange={(event) => updateBlock(block.id, { text: event.target.value })}
                />
              </label>
            ) : (
              <label>
                {blockLabels[block.type]}
                <input
                  value={block.text}
                  onChange={(event) => updateBlock(block.id, { text: event.target.value })}
                />
              </label>
            )}
          </section>
        ))}
      </div>
      <div className="block-inserter">
        <button
          className="block-add-button"
          type="button"
          aria-label="Adicionar bloco"
          aria-expanded={choosing}
          onClick={() => setChoosing((value) => !value)}
        >
          +
        </button>
        {choosing ? (
          <div className="block-type-menu" role="menu" aria-label="Escolha o tipo de bloco">
            {(Object.keys(blockLabels) as TouristAttractionBlock["type"][]).map((type) => (
              <button key={type} type="button" role="menuitem" onClick={() => addBlock(type)}>
                {blockLabels[type]}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </fieldset>
  );
}
