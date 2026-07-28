import { test, expect } from "@playwright/test";

const adminPassword = process.env.E2E_ADMIN_PASSWORD;

test("edita empresas originadas do seed sem erro de UUID", async ({ page }) => {
  test.skip(!adminPassword, "Credencial E2E administrativa não configurada.");
  test.setTimeout(180_000);
  const email = "contato@vempratorres.com.br";

  await page.goto("/admin");
  const login = page.locator("form").filter({ has: page.getByRole("button", { name: "Entrar" }) });
  await login.getByLabel("E-mail").fill(email);
  await login.getByLabel("Senha").fill(adminPassword!);
  await login.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  await page.goto("/admin/empresas");
  const companies = page.locator("details.panel");
  const count = await companies.count();
  for (let index = 0; index < count; index += 1) {
    const details = companies.nth(index);
    await details.evaluate((element: HTMLDetailsElement) => {
      element.open = true;
    });
    const id = await details.locator('input[name="id"]').first().inputValue();
    if (!id.startsWith("20000000-")) continue;
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/admin/empresas") && response.request().method() === "POST"
    );
    await details.getByRole("button", { name: "Salvar empresa" }).click();
    const response = await responsePromise;
    expect(response.status(), id).toBeLessThan(500);
    await page.goto("/admin/empresas");
  }
});
