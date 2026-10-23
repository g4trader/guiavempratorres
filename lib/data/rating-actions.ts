"use server";

import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAuthenticatedServerClient } from "@/lib/supabase/auth-server";
import { databaseUuid } from "@/lib/validation/database";
import { parseSlug } from "@/lib/validation/slugs";

export async function saveBusinessRating(form: FormData) {
  const businessId = databaseUuid.parse(form.get("business_id"));
  const slug = parseSlug(String(form.get("slug") ?? ""));
  const rating = z.coerce.number().int().min(1).max(5).parse(form.get("rating"));
  const commentValue = String(form.get("comment") ?? "").trim();
  const comment = z.string().max(150).parse(commentValue) || null;
  const client = await createAuthenticatedServerClient();
  if (!client) redirect(`/empresas/${slug}?avaliacao=erro` as Route);

  let {
    data: { user }
  } = await client.auth.getUser();
  if (!user) {
    const { data, error } = await client.auth.signInAnonymously();
    if (error || !data.user) redirect(`/empresas/${slug}?avaliacao=erro` as Route);
    user = data.user;
  }

  const { error } = await client.from("business_ratings").upsert(
    {
      business_id: businessId,
      user_id: user.id,
      rating,
      comment,
      updated_at: new Date().toISOString()
    },
    { onConflict: "business_id,user_id" }
  );

  if (error) redirect(`/empresas/${slug}?avaliacao=erro` as Route);
  revalidatePath(`/empresas/${slug}`);
  redirect(`/empresas/${slug}?avaliacao=salva` as Route);
}
