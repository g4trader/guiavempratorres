"use server";

import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { canManageAdminRoles, canManageCampaigns } from "@/lib/auth/authorization";
import { slugify } from "@/lib/domain";
import { createAuthenticatedServerClient, requireAdmin } from "@/lib/supabase/auth-server";
import { databaseUuid } from "@/lib/validation/database";

const text = (form: FormData, name: string) => String(form.get(name) ?? "").trim();
const optional = (form: FormData, name: string) => text(form, name) || null;
const checked = (form: FormData, name: string) => form.get(name) === "on";
const uuid = (value: FormDataEntryValue | null) => databaseUuid.parse(value);
const numberOrNull = (value: string) => (value ? Number(value.replace(",", ".")) : null);

function fail(path: string, message: string): never {
  redirect(`${path}?erro=${encodeURIComponent(message)}` as Route);
}

export async function saveCategory(form: FormData) {
  const { client } = await requireAdmin();
  const id = uuid(form.get("id"));
  const payload = {
    id,
    name: text(form, "name"),
    slug: text(form, "slug") || slugify(text(form, "name")),
    description: optional(form, "description"),
    image_path: optional(form, "image_path"),
    image_alt: optional(form, "image_alt"),
    display_order: Number(text(form, "display_order") || 0),
    is_active: checked(form, "is_active"),
    seo_title: optional(form, "seo_title"),
    seo_description: optional(form, "seo_description")
  };
  const { error } = await client.from("categories").upsert(payload);
  if (error) fail("/admin/categorias", "Não foi possível salvar a categoria.");
  revalidatePath("/admin/categorias");
  revalidatePath("/");
  redirect("/admin/categorias?mensagem=Categoria salva com sucesso.");
}

export async function deleteCategory(form: FormData) {
  const { client } = await requireAdmin();
  const { error } = await client
    .from("categories")
    .delete()
    .eq("id", uuid(form.get("id")));
  if (error) fail("/admin/categorias", "A categoria está em uso ou não pode ser excluída.");
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias?mensagem=Categoria excluída com sucesso.");
}

export async function saveBusiness(form: FormData) {
  const { client } = await requireAdmin();
  const id = uuid(form.get("id"));
  const status = z.enum(["draft", "published", "suspended", "archived"]).parse(form.get("status"));
  const payload = {
    id,
    plan_id: uuid(form.get("plan_id")),
    name: text(form, "name"),
    slug: text(form, "slug") || slugify(text(form, "name")),
    short_description: optional(form, "short_description"),
    description: optional(form, "description"),
    logo_path: optional(form, "logo_path"),
    hero_image_path: optional(form, "hero_image_path"),
    hero_image_alt: optional(form, "hero_image_alt"),
    status,
    address_line: optional(form, "address_line"),
    neighborhood: optional(form, "neighborhood"),
    city: text(form, "city") || "Torres",
    state: "RS",
    postal_code: optional(form, "postal_code"),
    latitude: numberOrNull(text(form, "latitude")),
    longitude: numberOrNull(text(form, "longitude")),
    phone: optional(form, "phone"),
    whatsapp: optional(form, "whatsapp"),
    email: optional(form, "email"),
    website_url: optional(form, "website_url"),
    instagram_url: optional(form, "instagram_url"),
    seo_title: optional(form, "seo_title"),
    seo_description: optional(form, "seo_description"),
    featured_home: checked(form, "featured_home"),
    featured_home_order: Number(text(form, "featured_home_order") || 0),
    featured_home_starts_at: optional(form, "featured_home_starts_at")
      ? new Date(text(form, "featured_home_starts_at")).toISOString()
      : null,
    featured_home_ends_at: optional(form, "featured_home_ends_at")
      ? new Date(text(form, "featured_home_ends_at")).toISOString()
      : null,
    published_at:
      status === "published" ? (optional(form, "published_at") ?? new Date().toISOString()) : null
  };
  if ((payload.latitude === null) !== (payload.longitude === null))
    fail("/admin/empresas", "Informe latitude e longitude juntas.");
  const { error } = await client.from("businesses").upsert(payload);
  if (error) fail("/admin/empresas", "Não foi possível salvar a empresa.");

  const categories = form.getAll("category_ids").map(String);
  const { error: relationDeleteError } = await client
    .from("business_categories")
    .delete()
    .eq("business_id", id);
  if (relationDeleteError) fail("/admin/empresas", "Não foi possível atualizar as categorias.");
  if (categories.length) {
    const { error: relationError } = await client.from("business_categories").insert(
      categories.map((categoryId, index) => ({
        business_id: id,
        category_id: categoryId,
        is_primary: index === 0
      }))
    );
    if (relationError) fail("/admin/empresas", "Não foi possível atualizar as categorias.");
  }
  revalidatePath("/admin/empresas");
  revalidatePath(`/empresas/${payload.slug}`);
  revalidatePath("/");
  redirect("/admin/empresas?mensagem=Empresa salva com sucesso.");
}

export async function deleteBusiness(form: FormData) {
  const { client } = await requireAdmin();
  const { error } = await client
    .from("businesses")
    .delete()
    .eq("id", uuid(form.get("id")));
  if (error) fail("/admin/empresas", "A empresa possui vínculos e não pode ser excluída.");
  revalidatePath("/admin/empresas");
  redirect("/admin/empresas?mensagem=Empresa excluída com sucesso.");
}

export async function saveGalleryImage(form: FormData) {
  const { client } = await requireAdmin();
  const businessId = uuid(form.get("business_id"));
  const path = text(form, "storage_path");
  if (!path) fail("/admin/empresas", "Envie uma imagem antes de salvar.");
  const { error } = await client.from("business_media").insert({
    business_id: businessId,
    kind: "gallery",
    storage_path: path,
    image_alt: text(form, "image_alt"),
    display_order: Number(text(form, "display_order") || 0),
    is_active: true
  });
  if (error) fail("/admin/empresas", "Não foi possível adicionar a imagem.");
  revalidatePath("/admin/empresas");
  redirect("/admin/empresas?mensagem=Imagem adicionada à galeria.");
}

export async function deleteGalleryImage(form: FormData) {
  const { client } = await requireAdmin();
  const id = uuid(form.get("id"));
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
  if (error) fail("/admin/empresas", "Não foi possível remover a imagem.");
  revalidatePath("/admin/empresas");
  redirect("/admin/empresas?mensagem=Imagem removida da galeria.");
}

export async function saveCampaign(form: FormData) {
  const { client, role } = await requireAdmin();
  if (!canManageCampaigns(role)) fail("/admin", "Acesso restrito a administradores.");
  const id = uuid(form.get("id"));
  const payload = {
    id,
    audience: z.enum(["HOME", "SITE", "CATEGORIES"]).parse(form.get("audience")),
    business_id: uuid(form.get("business_id")),
    placement_id: uuid(form.get("placement_id")),
    status: z.enum(["draft", "active", "paused", "archived"]).parse(form.get("status")),
    starts_at: new Date(text(form, "starts_at")).toISOString(),
    ends_at: new Date(text(form, "ends_at")).toISOString(),
    display_order: Number(text(form, "display_order") || 0),
    priority: Number(text(form, "priority") || 0),
    internal_path: text(form, "internal_path")
  };
  const { error } = await client.from("ad_campaigns").upsert(payload);
  if (error) fail("/admin/campanhas", "Não foi possível salvar a campanha.");
  const categoryIds = form.getAll("category_ids").map((value) => uuid(value));
  await client.from("ad_campaign_categories").delete().eq("campaign_id", id);
  if (payload.audience === "CATEGORIES") {
    if (!categoryIds.length)
      fail("/admin/campanhas", "Selecione ao menos uma categoria para esta campanha.");
    const { error: categoriesError } = await client
      .from("ad_campaign_categories")
      .insert(categoryIds.map((categoryId) => ({ campaign_id: id, category_id: categoryId })));
    if (categoriesError)
      fail("/admin/campanhas", "Não foi possível vincular as categorias da campanha.");
  }
  const { error: creativeError } = await client.from("ad_creatives").upsert(
    {
      campaign_id: id,
      desktop_image_path: text(form, "desktop_image_path"),
      mobile_image_path: optional(form, "mobile_image_path"),
      image_alt: text(form, "image_alt"),
      title: optional(form, "title"),
      description: optional(form, "description")
    },
    { onConflict: "campaign_id" }
  );
  if (creativeError) fail("/admin/campanhas", "Não foi possível salvar as imagens da campanha.");
  revalidatePath("/admin/campanhas");
  revalidatePath("/");
  revalidatePath("/categorias/[slug]", "page");
  redirect("/admin/campanhas?mensagem=Banner salvo com sucesso.");
}

export async function deleteCampaign(form: FormData) {
  const { client, role } = await requireAdmin();
  if (!canManageCampaigns(role)) fail("/admin", "Acesso restrito a administradores.");
  const { error } = await client
    .from("ad_campaigns")
    .delete()
    .eq("id", uuid(form.get("id")));
  if (error) fail("/admin/campanhas", "Não foi possível excluir a campanha.");
  revalidatePath("/admin/campanhas");
  redirect("/admin/campanhas?mensagem=Banner excluído com sucesso.");
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
  const password = z.string().min(8).parse(form.get("password"));
  const { error } = await client.auth.updateUser({ password });
  if (error) fail("/admin/redefinir-senha", "Não foi possível alterar a senha.");
  redirect("/admin?mensagem=senha-alterada");
}

export async function updateAdminRole(form: FormData) {
  const { client, role } = await requireAdmin();
  if (!canManageAdminRoles(role)) fail("/admin", "Acesso exclusivo de super administrador.");
  const userId = uuid(form.get("user_id"));
  const nextRole = z.enum(["super_admin", "admin", "editor"]).parse(form.get("role"));
  const { error } = await client.from("admin_roles").upsert({ user_id: userId, role: nextRole });
  if (error) fail("/admin/usuarios", "Não foi possível atualizar o papel.");
  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?mensagem=Papel atualizado com sucesso.");
}
