"use client";

import { useRef, useState } from "react";
import { FormattedText } from "@/components/public/FormattedText";

type InlineAction = "bold" | "italic" | "link";
type LineAction = "heading" | "subheading" | "bullet" | "numbered" | "quote";

export function RichTextEditor({
  name,
  label,
  defaultValue = ""
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(defaultValue);

  function replaceSelection(replacement: string, selectionStart: number, selectionEnd: number) {
    const nextValue = `${value.slice(0, selectionStart)}${replacement}${value.slice(selectionEnd)}`;
    setValue(nextValue);
    requestAnimationFrame(() => {
      const editor = editorRef.current;
      if (!editor) return;
      editor.focus();
      editor.setSelectionRange(selectionStart, selectionStart + replacement.length);
    });
  }

  function formatInline(action: InlineAction) {
    const editor = editorRef.current;
    if (!editor) return;
    const { selectionStart, selectionEnd } = editor;
    const selected = value.slice(selectionStart, selectionEnd);
    const fallback = action === "link" ? "texto do link" : "texto";
    const content = selected || fallback;
    const replacement =
      action === "bold"
        ? `**${content}**`
        : action === "italic"
          ? `*${content}*`
          : `[${content}](https://)`;
    replaceSelection(replacement, selectionStart, selectionEnd);
  }

  function formatLines(action: LineAction) {
    const editor = editorRef.current;
    if (!editor) return;
    const { selectionStart, selectionEnd } = editor;
    const lineStart = value.lastIndexOf("\n", Math.max(0, selectionStart - 1)) + 1;
    const nextBreak = value.indexOf("\n", selectionEnd);
    const lineEnd = nextBreak === -1 ? value.length : nextBreak;
    const lines = value.slice(lineStart, lineEnd).split("\n");
    const prefix =
      action === "heading"
        ? "## "
        : action === "subheading"
          ? "### "
          : action === "quote"
            ? "> "
            : "";
    const replacement = lines
      .map((line, index) => {
        const cleanLine = line.replace(/^(#{2,3}|>|[-*]|\d+\.)\s+/, "");
        if (action === "bullet") return `- ${cleanLine || "item"}`;
        if (action === "numbered") return `${index + 1}. ${cleanLine || "item"}`;
        return `${prefix}${cleanLine || "texto"}`;
      })
      .join("\n");
    replaceSelection(replacement, lineStart, lineEnd);
  }

  return (
    <div className="rich-text-field">
      <label htmlFor={`${name}-editor`}>{label}</label>
      <div className="rich-text-editor">
        <div className="rich-text-toolbar" role="toolbar" aria-label={`Formatação de ${label}`}>
          <button type="button" onClick={() => formatInline("bold")} aria-label="Negrito">
            <strong>B</strong>
          </button>
          <button type="button" onClick={() => formatInline("italic")} aria-label="Itálico">
            <em>I</em>
          </button>
          <button type="button" onClick={() => formatLines("heading")} aria-label="Título">
            Título
          </button>
          <button type="button" onClick={() => formatLines("subheading")} aria-label="Subtítulo">
            Subtítulo
          </button>
          <button
            type="button"
            onClick={() => formatLines("bullet")}
            aria-label="Lista com marcadores"
          >
            • Lista
          </button>
          <button type="button" onClick={() => formatLines("numbered")} aria-label="Lista numerada">
            1. Lista
          </button>
          <button type="button" onClick={() => formatLines("quote")} aria-label="Citação">
            “ Citação
          </button>
          <button type="button" onClick={() => formatInline("link")} aria-label="Inserir link">
            Link
          </button>
        </div>
        <textarea
          ref={editorRef}
          id={`${name}-editor`}
          name={name}
          rows={7}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <div className="rich-text-help">
          Selecione um trecho e use as ferramentas. Para listas, selecione uma ou mais linhas.
        </div>
        <div className="rich-text-preview" aria-live="polite">
          <strong>Pré-visualização</strong>
          {value.trim() ? (
            <FormattedText value={value} />
          ) : (
            <p className="muted">O resumo formatado aparecerá aqui.</p>
          )}
        </div>
      </div>
    </div>
  );
}
