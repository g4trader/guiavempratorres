import { expect, test } from "@playwright/test";

test("visitante navega pelo hero, categoria e empresa", async ({ page }) => {
  await page.goto("/");
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
  await expect(page.getByText("Prato Modelo")).toBeVisible();
  await expect(page.getByRole("link", { name: "Abrir no mapa" })).toHaveAttribute(
    "href",
    /google\.com\/maps/
  );
});

test("busca encontra empresas, categorias e itens", async ({ page }) => {
  await page.goto("/buscar?q=gastronomia");
  await expect(page.getByRole("heading", { name: "Gastronomia" })).toBeVisible();

  await page.goto("/buscar?q=Prato");
  await expect(page.getByRole("heading", { name: "Prato Modelo" })).toBeVisible();

  await page.goto("/buscar?q=Bistrô");
  await expect(page.getByRole("heading", { name: "Bistrô Horizonte Teste" })).toBeVisible();
});

test("cards de empresas exibem atalhos de contato e localização", async ({ page }) => {
  await page.goto("/");
  const homeCard = page.locator(".business-card").first();
  await expect(homeCard.locator(".business-card-rating")).toBeVisible();
  await expect(homeCard.getByRole("link", { name: /WhatsApp/ })).toBeVisible();
  await expect(homeCard.getByRole("link", { name: /Google Maps/ })).toBeVisible();

  await page.goto("/categorias/gastronomia");
  const categoryCard = page.locator(".business-card").first();
  await expect(categoryCard.locator(".business-card-rating")).toBeVisible();
  await expect(categoryCard.getByRole("link", { name: /WhatsApp/ })).toBeVisible();
  await expect(categoryCard.getByRole("link", { name: /Google Maps/ })).toBeVisible();
});

test("área administrativa exige autenticação", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Área administrativa" })).toBeVisible();
  const loginForm = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: "Entrar" }) });
  await expect(loginForm.getByLabel("E-mail")).toBeVisible();
  await expect(loginForm.getByLabel("Senha")).toBeVisible();
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

test("busca sem resultado mostra estado vazio", async ({ page }) => {
  await page.goto("/buscar?q=termo-inexistente-xyz");
  await expect(page.getByText("Nenhum resultado encontrado.")).toBeVisible();
});

test("rascunho e rotas inexistentes retornam 404", async ({ page }) => {
  await page.goto("/empresas/estudio-mar-de-mentirinha");
  await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();

  await page.goto("/categorias/categoria-inexistente");
  await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();
});
