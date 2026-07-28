import { describe, expect, it } from "vitest";
import { isHeroCapacityAvailable, slugify } from "@/lib/domain";
import {
  canManageAdminRoles,
  canManageCampaigns,
  canManageEditorialContent
} from "@/lib/auth/authorization";
import { slugSchema } from "@/lib/validation/slugs";

describe("slugify", () => {
  it("normaliza acentos e espaços", () =>
    expect(slugify("Café & Hospedagem")).toBe("cafe-hospedagem"));
});

describe("autorização administrativa", () => {
  it("separa conteúdo, campanhas e papéis", () => {
    expect(canManageEditorialContent("editor")).toBe(true);
    expect(canManageCampaigns("editor")).toBe(false);
    expect(canManageCampaigns("admin")).toBe(true);
    expect(canManageAdminRoles("admin")).toBe(false);
    expect(canManageAdminRoles("super_admin")).toBe(true);
  });
});

describe("slugSchema", () => {
  it("aceita slug canônico e rejeita entrada insegura", () => {
    expect(slugSchema.safeParse("turismo-e-lazer").success).toBe(true);
    expect(slugSchema.safeParse("../admin").success).toBe(false);
  });
});

describe("limite do hero", () => {
  it("aceita até o quinto anúncio", () => {
    expect(isHeroCapacityAvailable(4)).toBe(true);
    expect(isHeroCapacityAvailable(5)).toBe(false);
  });
});
