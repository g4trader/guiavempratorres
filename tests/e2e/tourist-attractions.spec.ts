import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";
import type { Database } from "@/lib/database.types";

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? "contato@vempratorres.com.br";
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

test("admin publica ponto turístico com blocos e mapa", async ({ page }) => {
  test.skip(!adminPassword || !supabaseUrl || !supabaseKey, "Credenciais E2E não configuradas.");
  test.setTimeout(180_000);
  const suffix = Date.now();
  const title = `Ponto Turístico E2E ${suffix}`;
  const slug = `ponto-turistico-e2e-${suffix}`;
  const fixture = resolve(process.cwd(), "public/brand/logo_vempratorres.png");
  const client = createClient<Database>(supabaseUrl!, supabaseKey!, { auth: { persistSession: false } });
  const uploadedPaths: string[] = [];

  try {
    const { error } = await client.auth.signInWithPassword({ email: adminEmail, password: adminPassword! });
    expect(error).toBeNull();
    await page.goto("/admin");
    await page.getByLabel("E-mail").fill(adminEmail);
    await page.getByLabel("Senha").fill(adminPassword!);
    await page.getByRole("button", { name: "Entrar" }).click();
    await page.goto("/admin/pontos-turisticos");
    await page.locator('summary[aria-label="Novo ponto turístico"]').click();
    const form = page.locator(".admin-create-content form");
    await form.getByLabel("Título *").fill(title);
    await form.getByLabel("Slug").fill(slug);
    await form.getByLabel("Status").selectOption("published");
    await form.getByLabel("Resumo para o card").fill("Um lugar especial para conhecer em Torres.");
    const cardUpload = form.locator(".image-upload").filter({ hasText: "Imagem do card" });
    await cardUpload.locator('input[type="file"]').setInputFiles(fixture);
    await expect(cardUpload.getByText("Imagem enviada. Salve o formulário.")).toBeVisible();
    uploadedPaths.push(await form.locator('input[name="card_image_path"]').inputValue());
    await form.getByLabel("Texto alternativo da imagem").fill("Vista do ponto turístico");

    const editor = form.locator(".block-editor");
    await editor.getByRole("button", { name: "Adicionar bloco" }).click();
    await editor.getByRole("menuitem", { name: "Título (H1)" }).click();
    await editor.locator(".content-block-admin").last().getByLabel("Título (H1)").fill("Uma experiência em Torres");
    await editor.getByRole("button", { name: "Adicionar bloco" }).click();
    await editor.getByRole("menuitem", { name: "Texto (parágrafo)" }).click();
    await editor.locator(".content-block-admin").last().getByLabel("Parágrafo").fill("Conteúdo editorial criado em blocos para apresentar o atrativo.");
    await editor.getByRole("button", { name: "Adicionar bloco" }).click();
    await editor.getByRole("menuitem", { name: "Imagem" }).click();
    const block = editor.locator(".content-block-admin").last();
    await block.locator('input[type="file"]').setInputFiles(fixture);
    await expect(block.getByText("Imagem enviada. Salve o formulário.")).toBeVisible();
    uploadedPaths.push(await block.locator('input[type="hidden"]').first().inputValue());
    await block.getByLabel("Texto alternativo").fill("Detalhe do ponto turístico");

    await form.getByLabel("Link do Google Maps").fill("https://www.google.com/maps/place/Torres/@-29.3357,-49.726,15z");
    await form.getByRole("button", { name: "Preencher localização" }).click();
    await expect(form.getByText("Localização importada com sucesso.")).toBeVisible();
    await form.getByRole("button", { name: "Salvar ponto turístico" }).click();
    await expect(page.locator("details.panel summary").getByText(title, { exact: true })).toBeVisible();

    await page.goto("/pontos-turisticos");
    const card = page.locator(".category-card").filter({ hasText: title });
    await expect(card).toBeVisible();
    await card.getByRole("link", { name: `Conhecer ${title}` }).click();
    await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
    await expect(page.getByText("Conteúdo editorial criado em blocos para apresentar o atrativo.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Abrir no Google Maps" })).toBeVisible();
  } finally {
    await client.from("tourist_attractions").delete().eq("slug", slug);
    for (const fullPath of uploadedPaths) {
      const [bucket, ...parts] = fullPath.split("/");
      if (bucket && parts.length) await client.storage.from(bucket).remove([parts.join("/")]);
    }
    await client.auth.signOut();
  }
});
