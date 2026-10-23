import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ from: vi.fn(), remove: vi.fn(), revalidate: vi.fn() }));
vi.mock("@/lib/supabase/auth-server", () => ({
  requireAdmin: async () => ({
    client: { from: mocks.from, storage: { from: () => ({ remove: mocks.remove }) } },
    role: "admin"
  }),
  createAuthenticatedServerClient: vi.fn()
}));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
import { deleteGalleryImage, saveBusiness } from "@/lib/data/content-actions";

beforeEach(() => vi.clearAllMocks());
describe("integridade de salvamento", () => {
  it("não grava empresa se alguma categoria possui UUID inválido", async () => {
    const form = new FormData();
    const fields = {
      id: "20000000-0000-4000-8000-000000000001",
      plan_id: "50000000-0000-4000-8000-000000000001",
      name: "Empresa teste",
      status: "draft",
      city: "Torres",
      state: "RS",
      google_maps_url: "https://www.google.com/maps?q=-29,-49",
      location_verified_url: "https://www.google.com/maps?q=-29,-49",
      category_ids: "invalid"
    };
    for (const [key, value] of Object.entries(fields)) form.set(key, value);
    await expect(saveBusiness(form)).rejects.toThrow("REDIRECT:");
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("falha ao remover referência sem apagar o arquivo publicado", async () => {
    mocks.from.mockReturnValue({
      delete: () => ({ eq: async () => ({ error: { message: "failure" } }) })
    });
    const form = new FormData();
    form.set("id", "20000000-0000-4000-8000-000000000001");
    await expect(deleteGalleryImage(form)).rejects.toThrow("erro=");
    expect(mocks.remove).not.toHaveBeenCalled();
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });
  it("remove somente a referência ao excluir uma imagem", async () => {
    mocks.from.mockReturnValue({ delete: () => ({ eq: async () => ({ error: null }) }) });
    const form = new FormData();
    form.set("id", "20000000-0000-4000-8000-000000000001");
    await expect(deleteGalleryImage(form)).rejects.toThrow("mensagem=");
    expect(mocks.remove).not.toHaveBeenCalled();
    expect(mocks.revalidate).toHaveBeenCalled();
  });
});
