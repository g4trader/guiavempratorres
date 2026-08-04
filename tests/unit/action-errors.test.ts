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
});
