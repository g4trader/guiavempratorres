import { expect, test } from "@playwright/test";

test("visitante navega pelo hero, categoria e empresa", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText("Modo demonstrativo");
  await expect(page.getByRole("banner").getByAltText("Vem Pra Torres")).toBeVisible();
  await expect(page.getByRole("contentinfo").getByAltText("Vem Pra Torres")).toBeVisible();
  await expect(page.getByRole("region", { name: "Empresas em destaque" })).toBeVisible();

  const firstTitle = await page.getByRole("heading", { level: 1 }).textContent();
  await page.getByRole("button", { name: "Próximo destaque" }).click();
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(firstTitle ?? "");

  await page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "Gastronomia" }) })
    .getByRole("link", { name: "Ver categoria" })
    .click();
  await expect(page).toHaveURL(/\/categorias\/gastronomia$/);

  await page.getByRole("link", { name: "Ver empresa" }).click();
  await expect(page.getByRole("heading", { name: "Itens" })).toBeVisible();
  await expect(page.getByText("Menu do dia")).toBeVisible();
  await expect(page.getByRole("link", { name: "Abrir no mapa" })).toHaveAttribute(
    "href",
    /openstreetmap/
  );
});

test("área administrativa exige autenticação", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Área administrativa" })).toBeVisible();
  await expect(page.getByLabel("E-mail")).toBeVisible();
  await expect(page.getByLabel("Senha")).toBeVisible();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
});

test("favicon e manifest usam a estrutura institucional", async ({ request }) => {
  const favicon = await request.get("/brand/favicon.svg");
  expect(favicon.status()).toBe(200);
  expect(favicon.headers()["content-type"]).toContain("image/svg+xml");

  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.status()).toBe(200);
  expect(await manifest.text()).toContain("/brand/favicon.svg");
});

test("categoria sem empresas mostra estado vazio", async ({ page }) => {
  await page.goto("/categorias/servicos");
  await expect(page.getByText("Ainda não há empresas publicadas nesta categoria.")).toBeVisible();
});

test("rascunho e rotas inexistentes retornam 404", async ({ page }) => {
  const draft = await page.goto("/empresas/estudio-mar-de-mentirinha");
  expect(draft?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();

  const missing = await page.goto("/categorias/categoria-inexistente");
  expect(missing?.status()).toBe(404);
});
