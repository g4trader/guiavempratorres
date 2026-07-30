import { describe, expect, it } from "vitest";
import { validateCommercialHighlight } from "@/lib/admin/commercial-validation";

describe("validateCommercialHighlight", () => {
  it("exige ordem quando o destaque está ativo", () => {
    expect(
      validateCommercialHighlight({
        enabled: true,
        order: "",
        startsAt: "",
        endsAt: ""
      }).orderError
    ).toBe("Informe a ordem de exibição do destaque.");
  });

  it("exige data final posterior à inicial", () => {
    expect(
      validateCommercialHighlight({
        enabled: true,
        order: "1",
        startsAt: "2026-08-01T10:00",
        endsAt: "2026-08-01T10:00"
      }).periodError
    ).toBe("A data final deve ser posterior à data inicial.");
  });

  it("aceita período e ordem válidos", () => {
    expect(
      validateCommercialHighlight({
        enabled: true,
        order: "2",
        startsAt: "2026-08-01T10:00",
        endsAt: "2026-08-02T10:00"
      })
    ).toEqual({ orderError: "", periodError: "" });
  });
});
