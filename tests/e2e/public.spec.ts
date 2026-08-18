import { expect, test } from "@playwright/test";

test("visitante navega pelo hero, categoria e empresa", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await expect(page.getByRole("banner").getByAltText("Vem Pra Torres")).toBeVisible();
  await expect(page.getByRole("contentinfo").getByAltText("Vem Pra Torres")).toBeVisible();
  await expect(page.getByRole("region", { name: "Empresas em destaque" })).toBeVisible();

  const bannerLink = page.getByRole("link", { name: /^Abrir anúncio:/ });
  const firstDestination = await bannerLink.getAttribute("href");
  await page.clock.fastForward(7000);
  await expect(bannerLink).not.toHaveAttribute("href", firstDestination ?? "");

  await page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "Gastronomia" }) })
    .getByRole("link", { name: "Ver categoria Gastronomia" })
    .click();
  await expect(page).toHaveURL(/\/categorias\/gastronomia$/);

  await page.getByRole("link", { name: /Ver empresa/ }).first().click();
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

test("cards de empresas mantêm conteúdo limpo e clique integral", async ({ page }) => {
  await page.goto("/");
  const homeCard = page.locator(".business-card").first();
  await expect(homeCard.locator(".business-card-rating")).toBeVisible();
  await expect(homeCard.locator(".business-card-description")).toBeVisible();
  await expect(homeCard.locator(".business-card-actions")).toHaveCount(0);
  await expect(homeCard.locator(".business-card-link")).toHaveCount(0);
  await expect(homeCard.getByText("Ver empresa", { exact: true })).toHaveCount(0);

  await page.goto("/categorias/gastronomia");
  const categoryCard = page.locator(".business-card").first();
  await expect(categoryCard.locator(".business-card-rating")).toBeVisible();
  await expect(categoryCard.locator(".business-card-actions")).toHaveCount(0);
  await expect(categoryCard.locator(".business-card-link")).toHaveCount(0);
});

test("cards completos de categoria e empresa são clicáveis", async ({ page }) => {
  await page.goto("/");
  const categoryCard = page
    .locator(".category-card")
    .filter({ has: page.getByRole("heading", { name: "Gastronomia" }) });
  await categoryCard.scrollIntoViewIfNeeded();
  const categoryImageBox = await categoryCard.locator(".category-image-frame").boundingBox();
  expect(categoryImageBox).not.toBeNull();
  await page.mouse.click(categoryImageBox!.x + 20, categoryImageBox!.y + 20);
  await expect(page).toHaveURL(/\/categorias\/[^/]+$/);

  const businessCard = page.locator(".business-card").first();
  await businessCard.scrollIntoViewIfNeeded();
  const businessImageBox = await businessCard.locator(".business-card-image-frame").boundingBox();
  expect(businessImageBox).not.toBeNull();
  await page.mouse.click(businessImageBox!.x + 20, businessImageBox!.y + 20);
  await expect(page).toHaveURL(/\/empresas\/[^/]+$/);
});

test("imagem do card de empresa preenche a moldura sem distorção", async ({ page }) => {
  await page.goto("/");
  const card = page.locator(".business-card").first();
  const frame = card.locator(".business-card-image-frame");
  const image = frame.locator("img");

  await card.scrollIntoViewIfNeeded();
  await expect(frame).toBeVisible();
  await expect(image).toHaveCSS("object-fit", "cover");
  const dimensions = await frame.evaluate((element) => {
    const imageElement = element.querySelector("img");
    return {
      frameWidth: element.clientWidth,
      frameHeight: element.clientHeight,
      imageWidth: imageElement?.clientWidth,
      imageHeight: imageElement?.clientHeight,
    };
  });
  expect(dimensions.imageWidth).toBe(dimensions.frameWidth);
  expect(dimensions.imageHeight).toBe(dimensions.frameHeight);
});

test("cards de categoria preenchem a moldura e mantêm o nome clicável", async ({ page }) => {
  await page.goto("/");
  const card = page.locator(".category-list-card").first();
  const frame = card.locator(".category-image-frame");
  const image = frame.locator("img");
  const name = card.locator(".category-card-name");

  await expect(card).toBeVisible();
  await card.scrollIntoViewIfNeeded();
  await expect(image).toHaveCSS("object-fit", "cover");
  await expect(name).toHaveCSS("background-color", "rgb(255, 255, 255)");

  const cardBox = await card.boundingBox();
  const frameBox = await frame.boundingBox();
  const imageBox = await image.boundingBox();
  expect(cardBox).not.toBeNull();
  expect(frameBox).not.toBeNull();
  expect(imageBox).not.toBeNull();
  expect(Math.abs(frameBox!.width - cardBox!.width)).toBeLessThanOrEqual(1);
  expect(Math.abs(imageBox!.width - frameBox!.width)).toBeLessThanOrEqual(1);
  expect(Math.abs(imageBox!.height - frameBox!.height)).toBeLessThanOrEqual(1);

  const nameBox = await name.boundingBox();
  expect(nameBox).not.toBeNull();
  await page.mouse.click(nameBox!.x + nameBox!.width / 2, nameBox!.y + nameBox!.height / 2);
  await expect(page).toHaveURL(/\/categorias\/[^/]+$/);
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

test("página da empresa usa galeria em carrossel e prioriza contatos", async ({ page }) => {
  await page.goto("/empresas/cristal-tur");
  await expect(page.locator(".business-gallery-carousel")).toBeVisible();
  await expect(page.getByRole("button", { name: "Próxima imagem" })).toBeVisible();
  await expect(page.locator(".business-about p")).toHaveCSS("font-size", /^(19|2\d)(\.\d+)?px$/);

  const headings = await page.locator(".detail-grid aside h2").allTextContents();
  expect(headings.slice(0, 3)).toEqual(["Contatos", "Avaliações", "Localização"]);
});

test("rascunho e rotas inexistentes retornam 404", async ({ page }) => {
  await page.goto("/empresas/estudio-mar-de-mentirinha");
  await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();

  await page.goto("/categorias/categoria-inexistente");
  await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();
});
