import { describe, expect, it } from "vitest";
import { databaseUuid } from "@/lib/validation/database";

describe("databaseUuid", () => {
  it("aceita identificadores UUID usados pelos dados iniciais", () => {
    expect(databaseUuid.parse("20000000-0000-0000-0000-000000000001")).toBe(
      "20000000-0000-0000-0000-000000000001"
    );
  });

  it("rejeita identificadores que não são UUIDs do PostgreSQL", () => {
    expect(databaseUuid.safeParse("empresa-invalida").success).toBe(false);
  });
});
