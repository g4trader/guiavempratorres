"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { z } from "zod";
import { explainDatabaseError } from "@/lib/admin/action-errors";
import { requireAdmin, createAuthenticatedServerClient } from "@/lib/supabase/auth-server";
import { slugify } from "@/lib/domain";
import { databaseUuid } from "@/lib/validation/database";

const booleanValue = (formData: FormData, name: string) => formData.get(name) === "on";
const textValue = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();
const optionalText = (formData: FormData, name: string) => textValue(formData, name) || null;

const planSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  max_images: z.coerce.number().int().min(0),
  max_items: z.coerce.number().int().min(0),
  priority: z.coerce.number().int()
});

const itemSchema = z
  .object({
    business_id: databaseUuid,
    type: z.enum(["PRODUCT", "SERVICE", "PROMOTION", "MENU", "CATALOG"]),
    title: z.string().min(2).max(140),
    description: z.string().nullable(),
    image: z.string().nullable(),
    price: z.number().min(0).nullable(),
    cta_label: z.string().nullable(),
    cta_url: z.string().url().nullable(),
    display_order: z.coerce.number().int().min(0)
  })
  .refine((item) => Boolean(item.cta_label) === Boolean(item.cta_url), {
    message: "Informe o texto e o link do CTA juntos."
  });

function adminError(
  path: "/admin" | "/admin/planos" | "/admin/itens" | "/admin/empresas",
  message: string
): never {
  redirect(`${path}?erro=${encodeURIComponent(message)}` as Route);
}

function planValidationMessage(parsed: z.ZodSafeParseResult<z.infer<typeof planSchema>>) {
  if (parsed.success) return null;
  const field = parsed.error.issues[0]?.path[0];
  if (field === "name") return "O nome do plano deve ter entre 2 e 100 caracteres.";
  if (field === "slug") return "O slug deve conter apenas letras minúsculas, números e hífens.";
  if (field === "max_images") return "O máximo de imagens deve ser um número inteiro igual ou maior que zero.";
  if (field === "max_items") return "O máximo de itens deve ser um número inteiro igual ou maior que zero.";
  if (field === "priority") return "A prioridade deve ser um número inteiro.";
  return "Revise os campos obrigatórios do plano.";
}

export async function signIn(formData: FormData) {
  const client = await createAuthenticatedServerClient();
  if (!client) adminError("/admin", "Supabase não configurado.");
  const email = textValue(formData, "email");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) adminError("/admin", "Informe o e-mail e a senha.");
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) adminError("/admin", "E-mail ou senha inválidos.");
  redirect("/admin");
}

export async function signOut() {
  const client = await createAuthenticatedServerClient();
  await client?.auth.signOut();
  redirect("/admin");
}

function parsePlan(formData: FormData) {
  return planSchema.safeParse({
    name: textValue(formData, "name"),
    slug: textValue(formData, "slug") || slugify(textValue(formData, "name")),
    max_images: formData.get("max_images"),
    max_items: formData.get("max_items"),
    priority: formData.get("priority")
  });
}

function planFlags(formData: FormData) {
  return {
    featured_home: booleanValue(formData, "featured_home"),
    featured_category: booleanValue(formData, "featured_category"),
    hero_allowed: booleanValue(formData, "hero_allowed"),
    whatsapp_enabled: booleanValue(formData, "whatsapp_enabled"),
    website_enabled: booleanValue(formData, "website_enabled"),
    instagram_enabled: booleanValue(formData, "instagram_enabled"),
    gallery_enabled: booleanValue(formData, "gallery_enabled"),
    video_enabled: booleanValue(formData, "video_enabled"),
    premium_badge: booleanValue(formData, "premium_badge")
  };
}

export async function createPlan(formData: FormData) {
  const path = "/admin/planos";
  const { client } = await requireAdmin();
  const parsed = parsePlan(formData);
  const validationMessage = planValidationMessage(parsed);
  if (!parsed.success) adminError(path, validationMessage!);
  const { error } = await client.from("plans").insert({ ...parsed.data, ...planFlags(formData) });
  if (error) adminError(path, explainDatabaseError(error, "Não foi possível criar o plano."));
  revalidatePath(path);
  redirect(`${path}?mensagem=Plano criado com sucesso.`);
}

export async function updatePlan(formData: FormData) {
  const path = "/admin/planos";
  const { client } = await requireAdmin();
  const id = databaseUuid.safeParse(formData.get("id"));
  if (!id.success) adminError(path, "Plano inválido. Atualize a página e tente novamente.");
  const parsed = parsePlan(formData);
  const validationMessage = planValidationMessage(parsed);
  if (!parsed.success) adminError(path, validationMessage!);
  const { error } = await client
    .from("plans")
    .update({ ...parsed.data, ...planFlags(formData) })
    .eq("id", id.data);
  if (error) adminError(path, explainDatabaseError(error, "Não foi possível atualizar o plano."));
  revalidatePath(path);
  redirect(`${path}?mensagem=Plano atualizado com sucesso.`);
}

export async function deletePlan(formData: FormData) {
  const path = "/admin/planos";
  const { client } = await requireAdmin();
  const id = databaseUuid.safeParse(formData.get("id"));
  if (!id.success) adminError(path, "Plano inválido. Atualize a página e tente novamente.");
  const { error } = await client.from("plans").delete().eq("id", id.data);
  if (error)
    adminError(path, explainDatabaseError(error, "O plano está vinculado a empresas e não pode ser excluído."));
  revalidatePath(path);
  redirect(`${path}?mensagem=Plano excluído com sucesso.`);
}

function parseItem(formData: FormData) {
  const priceText = textValue(formData, "price").replace(",", ".");
  const ctaLabel = optionalText(formData, "cta_label");
  const ctaUrl = optionalText(formData, "cta_url");
  return itemSchema.safeParse({
    business_id: formData.get("business_id"),
    type: formData.get("type"),
    title: textValue(formData, "title"),
    description: optionalText(formData, "description"),
    image: optionalText(formData, "image"),
    price: priceText ? Number(priceText) : null,
    cta_label: ctaLabel,
    cta_url: ctaUrl,
    display_order: formData.get("display_order")
  });
}

function itemValidationMessage(parsed: ReturnType<typeof parseItem>) {
  if (parsed.success) return null;
  const field = parsed.error.issues[0]?.path[0];
  if (field === "business_id") return "Selecione uma empresa válida para o item.";
  if (field === "title") return "O título do item deve ter entre 2 e 140 caracteres.";
  if (field === "price") return "O preço deve ser um número igual ou maior que zero.";
  if (field === "cta_url") return "Informe um link completo e válido para o CTA, começando com https://.";
  if (field === "display_order") return "A ordem deve ser um número inteiro igual ou maior que zero.";
  return parsed.error.issues[0]?.message ?? "Revise os campos obrigatórios do item.";
}

export async function createBusinessItem(formData: FormData) {
  const path = "/admin/empresas";
  const { client } = await requireAdmin();
  const parsed = parseItem(formData);
  if (!parsed.success) adminError(path, itemValidationMessage(parsed)!);
  const { error } = await client
    .from("business_items")
    .insert({ ...parsed.data, active: booleanValue(formData, "active") });
  if (error) adminError(path, explainDatabaseError(error, "Não foi possível criar o item."));
  revalidatePath("/admin/itens");
  revalidatePath(path);
  redirect(`${path}?mensagem=Item criado com sucesso.`);
}

export async function updateBusinessItem(formData: FormData) {
  const path = "/admin/empresas";
  const { client } = await requireAdmin();
  const id = databaseUuid.safeParse(formData.get("id"));
  if (!id.success) adminError(path, "Item inválido. Atualize a página e tente novamente.");
  const parsed = parseItem(formData);
  if (!parsed.success) adminError(path, itemValidationMessage(parsed)!);
  const { error } = await client
    .from("business_items")
    .update({ ...parsed.data, active: booleanValue(formData, "active") })
    .eq("id", id.data);
  if (error) adminError(path, explainDatabaseError(error, "Não foi possível atualizar o item."));
  revalidatePath("/admin/itens");
  revalidatePath(path);
  redirect(`${path}?mensagem=Item atualizado com sucesso.`);
}

export async function deleteBusinessItem(formData: FormData) {
  const path = "/admin/empresas";
  const { client } = await requireAdmin();
  const id = databaseUuid.safeParse(formData.get("id"));
  if (!id.success) adminError(path, "Item inválido. Atualize a página e tente novamente.");
  const { error } = await client.from("business_items").delete().eq("id", id.data);
  if (error) adminError(path, explainDatabaseError(error, "Não foi possível excluir o item."));
  revalidatePath("/admin/itens");
  revalidatePath(path);
  redirect(`${path}?mensagem=Item excluído com sucesso.`);
}
