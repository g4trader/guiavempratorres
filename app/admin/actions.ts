"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { z } from "zod";
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

const itemSchema = z.object({
  business_id: databaseUuid,
  type: z.enum(["PRODUCT", "SERVICE", "PROMOTION", "MENU", "CATALOG"]),
  title: z.string().min(2).max(140),
  description: z.string().nullable(),
  image: z.string().nullable(),
  price: z.number().min(0).nullable(),
  cta_label: z.string().nullable(),
  cta_url: z.string().url().nullable(),
  display_order: z.coerce.number().int().min(0)
});

function adminError(
  path: "/admin" | "/admin/planos" | "/admin/itens" | "/admin/empresas",
  message: string
): never {
  redirect(`${path}?erro=${encodeURIComponent(message)}` as Route);
}

export async function signIn(formData: FormData) {
  const client = await createAuthenticatedServerClient();
  if (!client) adminError("/admin", "Supabase não configurado.");

  const email = textValue(formData, "email");
  const password = String(formData.get("password") ?? "");
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
  const { client } = await requireAdmin();
  const parsed = parsePlan(formData);
  if (!parsed.success) adminError("/admin/planos", "Revise os campos do plano.");

  const { error } = await client.from("plans").insert({ ...parsed.data, ...planFlags(formData) });
  if (error) adminError("/admin/planos", "Não foi possível criar o plano.");
  revalidatePath("/admin/planos");
  redirect("/admin/planos?mensagem=Plano criado com sucesso.");
}

export async function updatePlan(formData: FormData) {
  const { client } = await requireAdmin();
  const id = databaseUuid.safeParse(formData.get("id"));
  const parsed = parsePlan(formData);
  if (!id.success || !parsed.success) adminError("/admin/planos", "Revise os campos do plano.");

  const { error } = await client
    .from("plans")
    .update({ ...parsed.data, ...planFlags(formData) })
    .eq("id", id.data);
  if (error) adminError("/admin/planos", "Não foi possível atualizar o plano.");
  revalidatePath("/admin/planos");
  redirect("/admin/planos?mensagem=Plano atualizado com sucesso.");
}

export async function deletePlan(formData: FormData) {
  const { client } = await requireAdmin();
  const id = databaseUuid.safeParse(formData.get("id"));
  if (!id.success) adminError("/admin/planos", "Plano inválido.");

  const { error } = await client.from("plans").delete().eq("id", id.data);
  if (error) adminError("/admin/planos", "O plano está em uso ou não pode ser excluído.");
  revalidatePath("/admin/planos");
  redirect("/admin/planos?mensagem=Plano excluído com sucesso.");
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
    cta_url: ctaLabel ? ctaUrl : null,
    display_order: formData.get("display_order")
  });
}

export async function createBusinessItem(formData: FormData) {
  const { client } = await requireAdmin();
  const parsed = parseItem(formData);
  if (!parsed.success) adminError("/admin/empresas", "Revise os campos do item.");

  const { error } = await client
    .from("business_items")
    .insert({ ...parsed.data, active: booleanValue(formData, "active") });
  if (error) adminError("/admin/empresas", "Não foi possível criar o item.");
  revalidatePath("/admin/itens");
  revalidatePath("/admin/empresas");
  redirect("/admin/empresas?mensagem=Item criado com sucesso.");
}

export async function updateBusinessItem(formData: FormData) {
  const { client } = await requireAdmin();
  const id = databaseUuid.safeParse(formData.get("id"));
  const parsed = parseItem(formData);
  if (!id.success || !parsed.success) adminError("/admin/empresas", "Revise os campos do item.");

  const { error } = await client
    .from("business_items")
    .update({ ...parsed.data, active: booleanValue(formData, "active") })
    .eq("id", id.data);
  if (error) adminError("/admin/empresas", "Não foi possível atualizar o item.");
  revalidatePath("/admin/itens");
  revalidatePath("/admin/empresas");
  redirect("/admin/empresas?mensagem=Item atualizado com sucesso.");
}

export async function deleteBusinessItem(formData: FormData) {
  const { client } = await requireAdmin();
  const id = databaseUuid.safeParse(formData.get("id"));
  if (!id.success) adminError("/admin/empresas", "Item inválido.");

  const { error } = await client.from("business_items").delete().eq("id", id.data);
  if (error) adminError("/admin/empresas", "Não foi possível excluir o item.");
  revalidatePath("/admin/itens");
  revalidatePath("/admin/empresas");
  redirect("/admin/empresas?mensagem=Item excluído com sucesso.");
}
