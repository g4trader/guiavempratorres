import { expect, test } from "@playwright/test";

test("visitante navega da home à empresa", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Descubra");
  await page.getByRole("link", { name: "Ver categoria", exact: true }).first().click();
  await expect(page).toHaveURL(/\/categorias\/gastronomia$/);
  await page.getByRole("link", { name: "Ver empresa" }).click();
  await expect(page.getByRole("heading", { name: "Produtos e serviços" })).toBeVisible();
});
