import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FormattedText } from "@/components/public/FormattedText";

describe("FormattedText", () => {
  it("renderiza as principais formatações sem inserir HTML arbitrário", () => {
    const html = renderToStaticMarkup(
      createElement(FormattedText, {
        value: "## Título\nTexto com **negrito** e *itálico*.\n- Primeiro\n- Segundo\n> Citação"
      })
    );

    expect(html).toContain("<h2>Título</h2>");
    expect(html).toContain("<strong>negrito</strong>");
    expect(html).toContain("<em>itálico</em>");
    expect(html).toContain("<ul>");
    expect(html).toContain("<blockquote>Citação</blockquote>");
  });

  it("não transforma protocolos inseguros em links", () => {
    const html = renderToStaticMarkup(
      createElement(FormattedText, { value: "[Clique](javascript:alert(1))" })
    );

    expect(html).not.toContain("href=");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("Clique");
  });
});
