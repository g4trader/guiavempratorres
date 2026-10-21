import { describe, expect, it } from "vitest";
import { imagePlacement } from "@/lib/media/image-layout";

describe("enquadramento de imagens", () => {
  it("recorta uma foto vertical sem distorção e permite escolher topo ou base", () => {
    expect(imagePlacement(600, 1200, 800, 600, "cover", 1, 50, 0)).toMatchObject({
      x: 0,
      width: 800,
      height: 1600
    });
    expect(imagePlacement(600, 1200, 800, 600, "cover", 1, 50, 0).y).toBeCloseTo(0);
    expect(imagePlacement(600, 1200, 800, 600, "cover", 1, 50, 100).y).toBe(-1000);
  });
  it("preserva toda uma arte horizontal independentemente dos controles de recorte", () => {
    expect(imagePlacement(1600, 720, 800, 600, "contain", 3, 0, 0)).toMatchObject({
      x: 0,
      y: 120,
      width: 800,
      height: 360
    });
  });
  it("mantém correspondência entre prévia e arquivo exportado", () => {
    const preview = imagePlacement(1920, 1080, 800, 600, "cover", 1.5, 25, 75);
    const output = imagePlacement(1920, 1080, 1600, 1200, "cover", 1.5, 25, 75);
    for (const key of ["x", "y", "width", "height", "scale"] as const)
      expect(output[key]).toBeCloseTo(preview[key] * 2);
  });
  it("rejeita dimensões inválidas", () => {
    expect(() => imagePlacement(0, 100, 800, 600, "cover")).toThrow("Dimensões inválidas");
  });
});
