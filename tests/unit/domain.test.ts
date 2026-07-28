import { describe, expect, it } from "vitest";
import { isHeroCapacityAvailable, slugify } from "@/lib/domain";

describe("slugify", () => {
  it("normaliza acentos e espaços", () =>
    expect(slugify("Café & Hospedagem")).toBe("cafe-hospedagem"));
});

describe("limite do hero", () => {
  it("aceita até o quinto anúncio", () => {
    expect(isHeroCapacityAvailable(4)).toBe(true);
    expect(isHeroCapacityAvailable(5)).toBe(false);
  });
});
