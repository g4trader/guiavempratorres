import { describe, expect, it } from "vitest";
import { assertWritableTestEnvironment } from "@/lib/validation/test-environment";
const safe = {
  E2E_ALLOW_WRITES: "true",
  E2E_SUPABASE_PROJECT_REF: "test-project",
  NEXT_PUBLIC_SUPABASE_URL: "https://test-project.supabase.co"
};
describe("proteção dos testes que gravam dados", () => {
  it("exige autorização explícita", () =>
    expect(() => assertWritableTestEnvironment({})).toThrow());
  it("rejeita produção mesmo com opt-in", () =>
    expect(() =>
      assertWritableTestEnvironment({ ...safe, E2E_SUPABASE_PROJECT_REF: "lcfkoltbcpaoauzlegsl" })
    ).toThrow());
  it("rejeita URL divergente", () =>
    expect(() =>
      assertWritableTestEnvironment({
        ...safe,
        NEXT_PUBLIC_SUPABASE_URL: "https://outro.supabase.co"
      })
    ).toThrow());
  it("rejeita site de produção com banco de testes", () =>
    expect(() =>
      assertWritableTestEnvironment({
        ...safe,
        E2E_BASE_URL: "https://www.guiavempratorres.com.br"
      })
    ).toThrow());
  it("permite projeto de testes explicitamente identificado", () =>
    expect(() => assertWritableTestEnvironment(safe)).not.toThrow());
});
