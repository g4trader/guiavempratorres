"use server";

import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { explainDatabaseError } from "@/lib/admin/action-errors";
import { canManageAdminRoles, canManageCampaigns } from "@/lib/auth/authorization";
import { slugify } from "@/lib/domain";
import { createAuthenticatedServerClient, requireAdmin } from "@/lib/supabase/auth-server";
import { databaseUuid } from "@/lib/validation/database";

const text = (form: FormData, name: string) => String(form.get(name) ?? "").trim();
const optional = (form: FormData, name: string) => text(form, name) || null;
const checked = (form: FormData, name: string) => form.get(name) === "on";
const numberOrNull = (value: string) => (value ? Number(value.replace(",", ".")) : null);

function fail(path: string, message: string): never {
  redirect(`${path}?erro=${encodeURIComponent(message)}` as Route);
}

function parseUuid(value: FormDataEntryValue | null, path: string, label: string) {
  const parsed = databaseUuid.safeParse(value);
  if (!parsed.success) fail(path, `${label} inválido. Atualize a página e tente novamente.`);
  return parsed.data;
}

function parseDate(value: string | null, path: string, label: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) fail(path, `${label} possui uma data inválida.`);
  return date.toISOString();
}

export async function saveCategory(form: FormData) {
  const path = "/admin/categorias";
  const { client } = await requireAdmin();
  const name = text(form, "name");
  if (name.length < 2) fail(path, "O nome da categoria deve ter pelo menos 2 caracteres.");
  const payload = {
    id: parseUuid(form.get("id"), path, "Categoria"),
    name,
    slug: text(form, "slug") || slugify(name),
    description: optional(form, "description"),
    image_path: optional(form, "image_path"),
    image_alt: optional(form, "image_alt"),
    display_order: Number(text(form, "display_order") || 0),
    is_active: checked(form, "is_active"),
    seo_title: optional(form, "seo_title"),
    seo_description: optional(form, "seo_description")
  };
  if (payload.image_path && !payload.image_alt)
    fail(path, "Informe o texto alternativo da imagem da categoria.");
  const { error } = await client.from("categories").upsert(payload);
  if (error) fail(path, explainDatabaseError(error, "Não foi possível salvar a categoria."));
  revalidatePath(path);
  revalidatePath("/");
  redirect(`${path}?mensagem=Categoria salva com sucesso.`);
}

export async function deleteCategory(form: FormData) {
  const path = "/admin/categorias";
  const { client } = await requireAdmin();
  const { error } = await client
    .from("categories")
    .delete()
    .eq("id", parseUuid(form.get("id"), path, "Categoria"));
  if (error)
    fail(path, explainDatabaseError(error, "A categoria está em uso e não pode ser excluída."));
  revalidatePath(path);
  redirect(`${path}?mensagem=Categoria excluída com sucesso.`);
}

export async function saveBusiness(form: FormData) {
  const path = "/admin/empresas";
  const { client } = await requireAdmin();
  const id = parseUuid(form.get("id"), path, "Empresa");
  const planId = parseUuid(form.get("plan_id"), path, "Plano");
  const statusResult = z
    .enum(["draft", "published", "suspended", "archived"])
    .safeParse(form.get("status"));
  if (!statusResult.success) fail(path, "Selecione um status válido para a empresa.");

  const name = text(form, "name");
  if (name.length < 2) fail(path, "O nome da empresa deve ter pelo menos 2 caracteres.");
  const city = text(form, "city");
  const googleMapsUrl = optional(form, "google_maps_url");
  if (!city || !googleMapsUrl)
    fail(path, "Importe a localização usando um link válido do Google Maps antes de salvar.");
  if (googleMapsUrl !== text(form, "location_verified_url"))
    fail(
      path,
      "O link do Google Maps foi alterado. Clique em “Preencher localização” antes de salvar."
    );

  const featuredHome = checked(form, "featured_home");
  const featuredOrderText = text(form, "featured_home_order");
  if (featuredHome && !featuredOrderText)
    fail(path, "Informe a ordem de exibição do destaque comercial na Home.");
  const featuredOrder = Number(featuredOrderText || 0);
  if (!Number.isInteger(featuredOrder) || featuredOrder < 0)
    fail(path, "A ordem do destaque deve ser um número inteiro igual ou maior que zero.");
  const featuredStartsAt = parseDate(
    optional(form, "featured_home_starts_at"),
    path,
    "Início da veiculação"
  );
  const featuredEndsAt = parseDate(
    optional(form, "featured_home_ends_at"),
    path,
    "Fim da veiculação"
  );
  if (
    featuredStartsAt &&
    featuredEndsAt &&
    new Date(featuredEndsAt).getTime() <= new Date(featuredStartsAt).getTime()
  )
    fail(path, "No destaque da Home, a data final deve ser posterior à data inicial.");

  const latitude = numberOrNull(text(form, "latitude"));
  const longitude = numberOrNull(text(form, "longitude"));
  if ((latitude === null) !== (longitude === null))
    fail(path, "Informe latitude e longitude juntas.");
  if (
    (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) ||
    (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180))
  )
    fail(
      path,
      "Informe coordenadas válidas: latitude entre -90 e 90 e longitude entre -180 e 180."
    );

  const heroImagePath = optional(form, "hero_image_path");
  const heroImageAlt = optional(form, "hero_image_alt");
  if (heroImagePath && !heroImageAlt) fail(path, "Informe o texto alternativo da imagem do Hero.");

  const payload = {
    id,
    plan_id: planId,
    name,
    slug: text(form, "slug") || slugify(name),
    short_description: optional(form, "short_description"),
    description: optional(form, "description"),
    logo_path: optional(form, "logo_path"),
    hero_image_path: heroImagePath,
    hero_image_alt: heroImageAlt,
    status: statusResult.data,
    address_line: optional(form, "address_line"),
    neighborhood: optional(form, "neighborhood"),
    city,
    state: text(form, "state") || "RS",
    postal_code: optional(form, "postal_code"),
    google_maps_url: googleMapsUrl,
    latitude,
    longitude,
    phone: optional(form, "phone"),
    whatsapp: optional(form, "whatsapp"),
    email: optional(form, "email"),
    website_url: optional(form, "website_url"),
    instagram_url: optional(form, "instagram_url"),
    seo_title: optional(form, "seo_title"),
    seo_description: optional(form, "seo_description"),
    featured_home: featuredHome,
    featured_home_order: featuredOrder,
    featured_home_starts_at: featuredHome ? featuredStartsAt : null,
    featured_home_ends_at: featuredHome ? featuredEndsAt : null,
    published_at:
      statusResult.data === "published"
        ? (parseDate(optional(form, "published_at"), path, "Data de publicação") ??
          new Date().toISOString())
        : null
  };
  const { error } = await client.from("businesses").upsert(payload);
  if (error)
    fail(
      path,
      explainDatabaseError(error, "Não foi possível salvar a empresa. Revise os campos informados.")
    );

  const categoryIds = form
    .getAll("category_ids")
    .map((value) => parseUuid(value, path, "Categoria"));
  const { error: relationDeleteError } = await client
    .from("business_categories")
    .delete()
    .eq("business_id", id);
  if (relationDeleteError)
    fail(
      path,
      explainDatabaseError(
        relationDeleteError,
        "A empresa foi salva, mas não foi possível atualizar suas categorias."
      )
    );
  if (categoryIds.length) {
    const { error: relationError } = await client.from("business_categories").insert(
      categoryIds.map((categoryId, index) => ({
        business_id: id,
        category_id: categoryId,
        is_primary: index === 0
      }))
    );
    if (relationError)
      fail(
        path,
        explainDatabaseError(
          relationError,
          "A empresa foi salva, mas não foi possível vincular as categorias selecionadas."
        )
      );
  }
  revalidatePath(path);
  revalidatePath(`/empresas/${payload.slug}`);
  revalidatePath("/");
  redirect(`${path}?mensagem=Empresa salva com sucesso.`);
}

export async function deleteBusiness(form: FormData) {
  const path = "/admin/empresas";
  const { client } = await requireAdmin();
  const { error } = await client
    .from("businesses")
    .delete()
    .eq("id", parseUuid(form.get("id"), path, "Empresa"));
  if (error)
    fail(path, explainDatabaseError(error, "A empresa possui vínculos e não pode ser excluída."));
  revalidatePath(path);
  redirect(`${path}?mensagem=Empresa excluída com sucesso.`);
}

export async function saveGalleryImage(form: FormData) {
  const path = "/admin/empresas";
  const { client } = await requireAdmin();
  const businessId = parseUuid(form.get("business_id"), path, "Empresa");
  const storagePath = text(form, "storage_path");
  if (!storagePath) fail(path, "Envie uma imagem antes de adicionar à galeria.");
  const imageAlt = text(form, "image_alt");
  if (!imageAlt) fail(path, "Informe o texto alternativo da imagem da galeria.");
  const { error } = await client.from("business_media").insert({
    business_id: businessId,
    kind: "gallery",
    storage_path: storagePath,
    image_alt: imageAlt,
    display_order: Number(text(form, "display_order") || 0),
    is_active: true
  });
  if (error)
    fail(path, explainDatabaseError(error, "Não foi possível adicionar a imagem à galeria."));
  revalidatePath(path);
  redirect(`${path}?mensagem=Imagem adicionada à galeria.`);
}

export async function deleteGalleryImage(form: FormData) {
  const path = "/admin/empresas";
  const { client } = await requireAdmin();
  const id = parseUuid(form.get("id"), path, "Imagem");
  const { data: image } = await client
    .from("business_media")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();
  if (image?.storage_path.startsWith("business-gallery/")) {
    await client.storage
      .from("business-gallery")
      .remove([image.storage_path.slice("business-gallery/".length)]);
  }
  const { error } = await client.from("business_media").delete().eq("id", id);
  if (error)
    fail(path, explainDatabaseError(error, "Não foi possível remover a imagem da galeria."));
  revalidatePath(path);
  redirect(`${path}?mensagem=Imagem removida da galeria.`);
}

export async function saveCampaign(form: FormData) {
  const path = "/admin/campanhas";
  const { client, role } = await requireAdmin();
  if (!canManageCampaigns(role)) fail("/admin", "Acesso restrito a administradores.");
  const id = parseUuid(form.get("id"), path, "Campanha");
  const audience = z.enum(["HOME", "SITE", "CATEGORIES"]).safeParse(form.get("audience"));
  const status = z.enum(["draft", "active", "paused", "archived"]).safeParse(form.get("status"));
  if (!audience.success) fail(path, "Selecione onde o Hero será exibido.");
  if (!status.success) fail(path, "Selecione um status válido para a campanha.");
  const startsAt = parseDate(optional(form, "starts_at"), path, "Data inicial");
  const endsAt = parseDate(optional(form, "ends_at"), path, "Data final");
  if (!startsAt || !endsAt) fail(path, "Informe as datas inicial e final da campanha.");
  if (new Date(endsAt).getTime() <= new Date(startsAt).getTime())
    fail(path, "A data final da campanha deve ser posterior à data inicial.");
  const payload = {
    id,
    audience: audience.data,
    business_id: parseUuid(form.get("business_id"), path, "Empresa"),
    placement_id: parseUuid(form.get("placement_id"), path, "Posição"),
    status: status.data,
    starts_at: startsAt,
    ends_at: endsAt,
    display_order: Number(text(form, "display_order") || 0),
    priority: Number(text(form, "priority") || 0),
    internal_path: text(form, "internal_path")
  };
  const { error } = await client.from("ad_campaigns").upsert(payload);
  if (error) fail(path, explainDatabaseError(error, "Não foi possível salvar o banner."));
  const categoryIds = form
    .getAll("category_ids")
    .map((value) => parseUuid(value, path, "Categoria"));
  await client.from("ad_campaign_categories").delete().eq("campaign_id", id);
  if (payload.audience === "CATEGORIES") {
    if (!categoryIds.length) fail(path, "Selecione ao menos uma categoria para esta campanha.");
    const { error: categoriesError } = await client
      .from("ad_campaign_categories")
      .insert(categoryIds.map((categoryId) => ({ campaign_id: id, category_id: categoryId })));
    if (categoriesError)
      fail(
        path,
        explainDatabaseError(categoriesError, "Não foi possível vincular as categorias ao banner.")
      );
  }
  const desktopImagePath = text(form, "desktop_image_path");
  const imageAlt = text(form, "image_alt");
  if (!desktopImagePath) fail(path, "Envie a imagem desktop do banner.");
  if (!imageAlt) fail(path, "Informe o texto alternativo do banner.");
  const { error: creativeError } = await client.from("ad_creatives").upsert(
    {
      campaign_id: id,
      desktop_image_path: desktopImagePath,
      mobile_image_path: optional(form, "mobile_image_path"),
      image_alt: imageAlt,
      title: optional(form, "title"),
      description: optional(form, "description")
    },
    { onConflict: "campaign_id" }
  );
  if (creativeError)
    fail(
      path,
      explainDatabaseError(creativeError, "Não foi possível salvar as imagens do banner.")
    );
  revalidatePath(path);
  revalidatePath("/");
  revalidatePath("/categorias/[slug]", "page");
  redirect(`${path}?mensagem=Banner salvo com sucesso.`);
}

export async function deleteCampaign(form: FormData) {
  const path = "/admin/campanhas";
  const { client, role } = await requireAdmin();
  if (!canManageCampaigns(role)) fail("/admin", "Acesso restrito a administradores.");
  const { error } = await client
    .from("ad_campaigns")
    .delete()
    .eq("id", parseUuid(form.get("id"), path, "Campanha"));
  if (error) fail(path, explainDatabaseError(error, "Não foi possível excluir o banner."));
  revalidatePath(path);
  redirect(`${path}?mensagem=Banner excluído com sucesso.`);
}

export async function requestPasswordReset(form: FormData) {
  const client = await createAuthenticatedServerClient();
  if (!client) fail("/admin", "Supabase não configurado.");
  await client.auth.resetPasswordForEmail(text(form, "email"), {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://guiavempratorres.vercel.app"}/admin/redefinir-senha`
  });
  redirect("/admin?mensagem=recuperacao");
}

export async function updatePassword(form: FormData) {
  const client = await createAuthenticatedServerClient();
  if (!client) fail("/admin", "Supabase não configurado.");
  const password = z.string().min(8).safeParse(form.get("password"));
  if (!password.success)
    fail("/admin/redefinir-senha", "A senha deve ter pelo menos 8 caracteres.");
  const { error } = await client.auth.updateUser({ password: password.data });
  if (error)
    fail(
      "/admin/redefinir-senha",
      explainDatabaseError(error, "Não foi possível alterar a senha.")
    );
  redirect("/admin?mensagem=senha-alterada");
}

export async function updateAdminRole(form: FormData) {
  const path = "/admin/usuarios";
  const { client, role } = await requireAdmin();
  if (!canManageAdminRoles(role)) fail("/admin", "Acesso exclusivo de super administrador.");
  const userId = parseUuid(form.get("user_id"), path, "Usuário");
  const nextRole = z.enum(["super_admin", "admin", "editor"]).safeParse(form.get("role"));
  if (!nextRole.success) fail(path, "Selecione um papel de usuário válido.");
  const { error } = await client
    .from("admin_roles")
    .upsert({ user_id: userId, role: nextRole.data });
  if (error) fail(path, explainDatabaseError(error, "Não foi possível atualizar o papel."));
  revalidatePath(path);
  redirect(`${path}?mensagem=Papel atualizado com sucesso.`);
}
