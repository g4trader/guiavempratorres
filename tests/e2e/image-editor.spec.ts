import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  const response = await page.goto("/demonstracao/imagens");
  test.skip(
    response?.status() === 404,
    "Demonstração disponível somente no servidor de desenvolvimento."
  );
});

test("ajusta foto e reutiliza o resultado sem enviar ao Storage", async ({ page }, testInfo) => {
  const writes: string[] = [];
  page.on("request", (request) => {
    if (["POST", "PUT", "DELETE"].includes(request.method()) && request.url().includes("/storage/"))
      writes.push(request.url());
  });
  await page.getByRole("button", { name: "Experimentar com exemplo" }).click();
  await expect(page.getByRole("img", { name: "Prévia do enquadramento" })).toBeVisible();
  await page.getByRole("button", { name: "Simular salvar cadastro" }).click();
  await expect(
    page.getByText("Aplique ou cancele o ajuste da imagem antes de salvar.")
  ).toBeVisible();
  await expect(page.getByText("Cadastro simulado.", { exact: false })).not.toBeVisible();
  await page.getByLabel("Zoom", { exact: true }).fill("1.5");
  await page.getByLabel("Posição horizontal").fill("25");
  await page.getByRole("button", { name: "Aplicar imagem" }).click();
  const cardImage = page.locator(".image-demo-card img");
  await expect(cardImage).toBeVisible();
  await expect(cardImage).toHaveJSProperty("naturalWidth", 640);
  await expect(cardImage).toHaveJSProperty("naturalHeight", 480);
  await page.getByRole("button", { name: "Ajustar novamente" }).click();
  await page.getByRole("button", { name: "Cancelar ajuste" }).click();
  await expect(cardImage).toBeVisible();
  await page.getByRole("button", { name: "Simular salvar cadastro" }).click();
  await expect(page.getByText("Cadastro simulado.", { exact: false })).toBeVisible();
  expect(writes).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("cadastro-imagens.png"), fullPage: true });
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      )
    )
    .toBe(0);
});

test("arte com texto começa inteira e pode ser removida sem apagar arquivos", async ({ page }) => {
  await page.getByRole("button", { name: "Banner de campanha", exact: true }).click();
  await page.getByRole("button", { name: "Experimentar com exemplo" }).click();
  await expect(page.getByRole("radio", { name: "Mostrar imagem inteira" })).toBeChecked();
  await expect(page.getByLabel("Zoom", { exact: true })).not.toBeVisible();
  await page.getByRole("button", { name: "Aplicar imagem" }).click();
  await expect(page.getByAltText("Campanha de demonstração")).toBeVisible();
  await page.getByRole("button", { name: "Remover", exact: true }).click();
  await expect(page.getByText("Sua imagem aparece aqui")).toBeVisible();
});

test("logo mantém proporção e arquivo original; imagem inválida informa erro", async ({ page }) => {
  await page.getByRole("button", { name: "Logo", exact: true }).click();
  const input = page.locator('input[type="file"]');
  await input.setInputFiles({
    name: "invalida.png",
    mimeType: "image/png",
    buffer: Buffer.from("not an image")
  });
  await expect(page.getByText(/Não foi possível abrir esta imagem/)).toBeVisible();
  await page.getByRole("button", { name: "Experimentar com exemplo" }).click();
  await expect(page.getByRole("radio")).toHaveCount(0);
  await page.getByRole("button", { name: "Aplicar imagem" }).click();
  await expect(page.getByAltText("Logo de demonstração")).toHaveJSProperty("naturalWidth", 1600);
  await expect(page.getByAltText("Logo de demonstração")).toHaveJSProperty("naturalHeight", 720);
});
