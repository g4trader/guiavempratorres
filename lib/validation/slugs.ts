import { z } from "zod";

export const slugSchema = z
  .string()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export function parseSlug(value: string): string {
  return slugSchema.parse(value);
}
