import { resolve } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { expect, test, type Locator } from "@playwright/test";
import type { Database } from "@/lib/database.types";

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? "contato@vempratorres.com.br";
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function openDetails(details: Locator) {
  await details.evaluate((element: HTMLDetailsElement) => {
    element.open = true;
  });
}

test.describe("fluxos administrativos", () => {
  test.skip(
    !adminPassword || !supabaseUrl || !supabaseKey,
    "Credenciais E2E administrativas não configuradas."
  );
  test.describe.configure({ mode: "serial" });

  const suffix = `${Date.now()}`;
  const planName = `Plano E2E ${suffix}`;
  const planSlug = `plano-e2e-${suffix}`;
  const categoryName = `Categoria E2E ${suffix}`;
  const categorySlug = `categoria-e2e-${suffix}`;
  const businessName = `Empresa E2E ${suffix}`;
  const businessSlug = `empresa-e2e-${suffix}`;
  const uploadFixture = resolve(process.cwd(), "public/brand/logo_vempratorres.png");
  const uploadedPaths: string[] = [];
  let adminClient: SupabaseClient<Database>;

  test.beforeAll(async () => {
    adminClient = createClient<Database>(supabaseUrl!, supabaseKey!, {
      auth: { persistSession: false }
    });
    const { error } = await adminClient.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword!
    });
    expect(error).toBeNull();
  });

  test.afterAll(async () => {
    const { data: business } = await adminClient
      .from("businesses")
      .select("id")
      .eq("slug", businessSlug)
      .maybeSingle();
    if (business) {
      await adminClient.from("ad_campaigns").delete().eq("business_id", business.id);
      await adminClient.from("business_items").delete().eq("business_id", business.id);
      await adminClient.from("businesses").delete().eq("id", business.id);
    }
    await adminClient.from("categories").delete().eq("slug", categorySlug);
    await adminClient.from("plans").delete().eq("slug", planSlug);
    for (const fullPath of uploadedPaths) {
      const [bucket, ...objectParts] = fullPath.split("/");
      await adminClient.storage.from(bucket).remove([objectParts.join("/")]);
    }
    await adminClient.auth.signOut();
  });

  test("cria e atualiza plano, categoria, empresa, item e campanha", async ({ page }) => {
    test.setTimeout(180_000);
    const serverErrors: string[] = [];
    page.on("response", (response) => {
      if (response.status() >= 500) serverErrors.push(`${response.status()} ${response.url()}`);
    });

    await page.goto("/admin");
    const loginForm = page.locator("form").filter({
      has: page.getByRole("button", { name: "Entrar" })
    });
    await loginForm.getByLabel("E-mail").fill(adminEmail);
    await loginForm.getByLabel("Senha").fill(adminPassword!);
    await loginForm.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    await page.goto("/admin/planos");
    await page.locator('summary[aria-label="Novo plano"]').click();
    const planCreate = page.locator(".admin-create-content form");
    await planCreate.getByLabel("Nome").fill(planName);
    await planCreate.getByLabel("Slug").fill(planSlug);
    await planCreate.getByLabel("Máximo de imagens").fill("8");
    await planCreate.getByLabel("Máximo de itens").fill("20");
    await planCreate.getByLabel("Prioridade").fill("10");
    await planCreate.getByRole("button", { name: "Criar plano" }).click();
    await expect(
      page.locator("details.panel summary").getByText(planName, { exact: true })
    ).toBeVisible();

    await page.goto("/admin/categorias");
    await page.locator('summary[aria-label="Nova categoria"]').click();
    const categoryCreate = page.locator(".admin-create-content form");
    await categoryCreate.getByLabel("Nome").fill(categoryName);
    await categoryCreate.getByLabel("Slug").fill(categorySlug);
    await categoryCreate
      .getByLabel("Descrição", { exact: true })
      .fill("Categoria temporária para validação E2E.");
    const categoryResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/admin/categorias") &&
        response.request().method() === "POST"
    );
    await categoryCreate.getByRole("button", { name: "Salvar categoria" }).click();
    const categoryResponse = await categoryResponsePromise;
    const categoryResponseBody = await categoryResponse.text();
    expect(categoryResponse.status(), categoryResponseBody).toBeLessThan(500);
    expect(categoryResponseBody).not.toContain("Não foi possível salvar a categoria");
    await expect(
      page.locator("details.panel summary").getByText(categoryName, { exact: true })
    ).toBeVisible();

    await page.goto("/admin/empresas");
    await page.locator('summary[aria-label="Nova empresa"]').click();
    const businessCreate = page.locator(".admin-create-content form");
    await businessCreate.getByLabel("Nome").fill(businessName);
    await businessCreate.getByLabel("Slug").fill(businessSlug);
    await businessCreate.getByLabel("Plano").selectOption({ label: planName });
    await businessCreate.getByLabel("Resumo").fill("Empresa temporária para validação E2E.");
    await businessCreate.getByLabel("Status").selectOption("published");
    await businessCreate.getByLabel("WhatsApp").fill("5551999999999");
    await businessCreate.getByLabel("Instagram").fill("https://instagram.com/vempratorres");
    await businessCreate.getByRole("button", { name: "Salvar empresa" }).click();
    await expect(
      page.locator("details.panel summary").getByText(businessName, { exact: true })
    ).toBeVisible();

    let refreshedBusinessDetails = page.locator("details.panel").filter({ hasText: businessName });
    await openDetails(refreshedBusinessDetails);
    const logoUpload = refreshedBusinessDetails
      .locator(".image-upload")
      .filter({ hasText: "Logo" });
    await logoUpload.locator('input[type="file"]').setInputFiles(uploadFixture);
    await expect(logoUpload.getByText("Imagem enviada. Salve o formulário.")).toBeVisible();
    uploadedPaths.push(await refreshedBusinessDetails.locator('input[name="logo_path"]').inputValue());
    await refreshedBusinessDetails.getByRole("button", { name: "Salvar empresa" }).click();
    await expect(
      page.locator("details.panel summary").getByText(businessName, { exact: true })
    ).toBeVisible();

    refreshedBusinessDetails = page.locator("details.panel").filter({ hasText: businessName });
    await openDetails(refreshedBusinessDetails);
    const galleryForm = refreshedBusinessDetails.locator(".gallery-admin form.admin-form");
    const galleryUpload = galleryForm.locator(".image-upload");
    await galleryUpload.locator('input[type="file"]').setInputFiles(uploadFixture);
    await expect(galleryUpload.getByText("Imagem enviada. Salve o formulário.")).toBeVisible();
    uploadedPaths.push(await galleryForm.locator('input[name="storage_path"]').inputValue());
    await galleryForm.getByLabel("Texto alternativo").fill("Imagem temporária da galeria");
    await galleryForm.getByRole("button", { name: "Adicionar à galeria" }).click();
    await expect(page.getByText("Imagem temporária da galeria", { exact: true })).toBeVisible();

    refreshedBusinessDetails = page.locator("details.panel").filter({ hasText: businessName });
    await openDetails(refreshedBusinessDetails);
    await refreshedBusinessDetails
      .getByRole("button", { name: "Adicionar item" })
      .click();
    const itemDialog = page.getByRole("dialog");
    await itemDialog.getByLabel("Título").fill(`Item E2E ${suffix}`);
    await itemDialog.getByLabel("Descrição", { exact: true }).fill("Item temporário.");
    await itemDialog.getByLabel("Preço").fill("25.90");
    await itemDialog.getByRole("button", { name: "Criar item" }).click();
    await expect(page.getByText(`Item E2E ${suffix}`, { exact: true })).toBeVisible();

    await page.goto("/admin/campanhas");
    await page.locator('summary[aria-label="Nova campanha"]').click();
    const campaignCreate = page.locator(".admin-create-content form");
    await campaignCreate.getByLabel("Empresa").selectOption({ label: businessName });
    await campaignCreate.getByLabel("Status").selectOption("draft");
    await campaignCreate.getByLabel("Início").fill("2026-07-28T12:00");
    await campaignCreate.getByLabel("Fim").fill("2026-08-28T12:00");
    await campaignCreate.getByLabel("Caminho interno").fill(`/empresas/${businessSlug}`);
    await campaignCreate.getByLabel("Texto alternativo").fill("Banner temporário de teste");
    await campaignCreate.getByLabel("Título").fill(`Campanha E2E ${suffix}`);
    const desktopUpload = campaignCreate
      .locator(".image-upload")
      .filter({ hasText: "Imagem desktop" });
    await desktopUpload.locator('input[type="file"]').setInputFiles(uploadFixture);
    await expect(desktopUpload.getByText("Imagem enviada. Salve o formulário.")).toBeVisible();
    uploadedPaths.push(await campaignCreate.locator('input[name="desktop_image_path"]').inputValue());
    const mobileUpload = campaignCreate
      .locator(".image-upload")
      .filter({ hasText: "Imagem mobile" });
    await mobileUpload.locator('input[type="file"]').setInputFiles(uploadFixture);
    await expect(mobileUpload.getByText("Imagem enviada. Salve o formulário.")).toBeVisible();
    uploadedPaths.push(await campaignCreate.locator('input[name="mobile_image_path"]').inputValue());
    await campaignCreate.getByRole("button", { name: "Salvar campanha" }).click();
    await expect(
      page.locator("details.panel summary strong").filter({ hasText: businessName }).first()
    ).toBeVisible();

    await page.goto(`/empresas/${businessSlug}`);
    await expect(page.getByRole("heading", { name: businessName })).toBeVisible();
    await page.getByRole("radio", { name: "5 estrelas", exact: true }).check();
    await page.getByRole("button", { name: "Enviar avaliação" }).click();
    await expect(page.getByRole("button", { name: "Atualizar avaliação" })).toBeVisible();

    await page.goto("/admin/usuarios");
    await expect(page.getByRole("heading", { name: "Usuários" })).toBeVisible();
    expect(serverErrors).toEqual([]);
  });
});
