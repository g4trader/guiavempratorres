export type ImageFit = "cover" | "contain";

/** Shared by the editor preview and exported image; coordinates are canvas pixels. */
export function imagePlacement(
  width: number,
  height: number,
  targetWidth: number,
  targetHeight: number,
  fit: ImageFit,
  zoom = 1,
  x = 50,
  y = 50
) {
  if (
    [width, height, targetWidth, targetHeight].some(
      (value) => !Number.isFinite(value) || value <= 0
    )
  ) {
    throw new Error("Dimensões inválidas.");
  }
  const scale =
    (fit === "cover" ? Math.max : Math.min)(targetWidth / width, targetHeight / height) *
    (fit === "cover" ? Math.max(1, Math.min(3, zoom)) : 1);
  const drawWidth = width * scale;
  const drawHeight = height * scale;
  return {
    x: (targetWidth - drawWidth) * (fit === "cover" ? Math.max(0, Math.min(100, x)) / 100 : 0.5),
    y: (targetHeight - drawHeight) * (fit === "cover" ? Math.max(0, Math.min(100, y)) / 100 : 0.5),
    width: drawWidth,
    height: drawHeight,
    scale
  };
}
