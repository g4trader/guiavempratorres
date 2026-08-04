import { describe, expect, it } from "vitest";
import { explainDatabaseError } from "@/lib/admin/action-errors";

describe("explainDatabaseError", () => {
  it("explica conflito de slug", () => {
    expect(
      explainDatabaseError(
        { code: "23505", message: "duplicate key violates businesses_slug_key" },
        "Falha genérica."
      )
    ).toBe("Já existe um cadastro usando este slug.");
  });

  it("explica período inválido do destaque", () => {
    expect(
      explainDatabaseError(
        {
          code: "23514",
          message: "violates businesses_featured_home_period_check"
        },
        "Falha genérica."
      )
    ).toBe("No destaque da Home, a data final deve ser posterior à data inicial.");
  });

  it("explica formato inválido do link do Google Maps", () => {
    expect(
      explainDatabaseError(
        { code: "23514", message: "violates businesses_google_maps_url_check" },
        "Falha genérica."
      )
    ).toContain("O link do Google Maps não está em um formato aceito");
  });

  it("explica destino inválido de banner", () => {
    expect(
      explainDatabaseError(
        { code: "23514", message: "violates ad_campaigns_destination_url_check" },
        "Falha genérica."
      )
    ).toBe("O link de destino do banner não corresponde ao tipo selecionado.");
  });

  it("explica locais de exibição incompatíveis no banner", () => {
    expect(
      explainDatabaseError(
        { code: "23514", message: "violates ad_campaigns_display_locations_check" },
        "Falha genérica."
      )
    ).toContain("Selecione onde o banner deve ser exibido");
  });

  it("identifica a constraint quando ainda não existe tradução específica", () => {
    expect(
      explainDatabaseError(
        { code: "23514", message: 'violates check constraint "regra_nova_check"' },
        "Falha genérica."
      )
    ).toContain("regra_nova_check");
  });
});
