"use server";

import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { explainDatabaseError } from "@/lib/admin/action-errors";
import { slugify } from "@/lib/domain";
import { isPersistableGoogleMapsUrl } from "@/lib/google-maps";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { databaseUuid } from "@/lib/validation/database";

const blockSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string().uuid(),
    type: z.enum(["H1", "H2", "PARAGRAPH"]),
    text: z.string().trim().min(1).max(10_000)
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal("IMAGE"),
    imagePath: z.string().trim().min(1),
    imageAlt: z.string().trim().min(1).max(300)
  })
]);

const text = (form: FormData, name: string) => String(form.get(name) ?? "").trim();
const optional = (form: FormData, name: string) => text(form, name) || null;

function fail(message: string): never {
  redirect(`/admin/pontos-turisticos?erro=${encodeURIComponent(message)}` as Route);
}

export async function saveTouristAttraction(form: FormData) {
  const { client } = await requireAdmin();
  const idResult = databaseUuid.safeParse(form.get("id"));
  if (!idResult.success) fail("Ponto turístico inválido. Atualize a página e tente novamente.");
  const title = text(form, "title");
  if (title.length < 2) fail("Informe um título com pelo menos 2 caracteres.");
  const slug = slugify(text(form, "slug") || title);
  if (!slug) fail("Informe um título que permita gerar um slug válido.");
  const excerptResult = z.string().max(5_000).nullable().safeParse(optional(form, "excerpt"));
  if (!excerptResult.success) fail("O resumo para o card deve ter no máximo 5.000 caracteres.");
  const statusResult = z
    .enum(["draft", "published", "suspended", "archived"])
    .safeParse(form.get("status"));
  if (!statusResult.success) fail("Selecione um status válido.");
  let rawBlocks: unknown;
  try {
    rawBlocks = JSON.parse(text(form, "content_blocks") || "[]");
  } catch {
    fail("O conteúdo em blocos está inválido.");
  }
  const blocksResult = z.array(blockSchema).max(100).safeParse(rawBlocks);
  if (!blocksResult.success) fail("Revise os blocos: textos e imagens precisam estar preenchidos.");
  const cardImagePath = optional(form, "card_image_path");
  const cardImageAlt = optional(form, "card_image_alt");
  if (Boolean(cardImagePath) !== Boolean(cardImageAlt))
    fail("Envie a imagem do card e informe seu texto alternativo juntos.");
  const googleMapsUrl = optional(form, "google_maps_url");
  if (!googleMapsUrl || googleMapsUrl !== text(form, "location_verified_url"))
    fail("Preencha e valide a localização pelo link do Google Maps antes de salvar.");
  if (!isPersistableGoogleMapsUrl(googleMapsUrl))
    fail("Importe novamente a localização usando um link copiado do Google Maps.");
  const latitude = Number(text(form, "latitude"));
  const longitude = Number(text(form, "longitude"));
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude))
    fail("Não foi possível identificar as coordenadas do local.");
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180)
    fail("As coordenadas importadas do local estão fora dos limites válidos.");

  const payload = {
    id: idResult.data,
    title,
    slug,
    excerpt: excerptResult.data,
    card_image_path: cardImagePath,
    card_image_alt: cardImageAlt,
    content_blocks: blocksResult.data,
    google_maps_url: googleMapsUrl,
    address_line: optional(form, "address_line"),
    neighborhood: optional(form, "neighborhood"),
    city: optional(form, "city"),
    state: optional(form, "state"),
    postal_code: optional(form, "postal_code"),
    latitude,
    longitude,
    status: statusResult.data,
    seo_title: optional(form, "seo_title"),
    seo_description: optional(form, "seo_description"),
    published_at: statusResult.data === "published" ? new Date().toISOString() : null
  };
  const { error } = await client.from("tourist_attractions").upsert(payload);
  if (error) fail(explainDatabaseError(error, "Não foi possível salvar o ponto turístico."));
  revalidatePath("/pontos-turisticos");
  revalidatePath(`/pontos-turisticos/${payload.slug}`);
  redirect("/admin/pontos-turisticos?mensagem=Ponto turístico salvo com sucesso.");
}

export async function deleteTouristAttraction(form: FormData) {
  const { client } = await requireAdmin();
  const idResult = databaseUuid.safeParse(form.get("id"));
  if (!idResult.success) fail("Ponto turístico inválido.");
  const { error } = await client.from("tourist_attractions").delete().eq("id", idResult.data);
  if (error) fail(explainDatabaseError(error, "Não foi possível excluir o ponto turístico."));
  revalidatePath("/pontos-turisticos");
  redirect("/admin/pontos-turisticos?mensagem=Ponto turístico excluído com sucesso.");
}
