"use server";

import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAuthenticatedServerClient } from "@/lib/supabase/auth-server";

function returnPath(form: FormData) {
  const value = String(form.get("retorno") ?? "/");
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function signInGuideUser(form: FormData) {
  const client = await createAuthenticatedServerClient();
  const email = z.string().email().parse(form.get("email"));
  const password = z.string().min(8).parse(form.get("password"));
  const destination = returnPath(form);
  if (!client)
    redirect(`/entrar?erro=configuracao&retorno=${encodeURIComponent(destination)}` as Route);

  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error)
    redirect(`/entrar?erro=credenciais&retorno=${encodeURIComponent(destination)}` as Route);
  redirect(destination as Route);
}

export async function signUpGuideUser(form: FormData) {
  const client = await createAuthenticatedServerClient();
  const email = z.string().email().parse(form.get("email"));
  const password = z.string().min(8).parse(form.get("password"));
  const displayName = z.string().trim().min(2).max(100).parse(form.get("display_name"));
  const destination = returnPath(form);
  if (!client)
    redirect(`/entrar?erro=configuracao&retorno=${encodeURIComponent(destination)}` as Route);

  const origin = (await headers()).get("origin") ?? "";
  const callback = `${origin}/entrar/confirmar?retorno=${encodeURIComponent(destination)}`;
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: callback
    }
  });
  if (error) redirect(`/entrar?erro=cadastro&retorno=${encodeURIComponent(destination)}` as Route);
  if (data.session) redirect(destination as Route);
  redirect(`/entrar?mensagem=confirmacao&retorno=${encodeURIComponent(destination)}` as Route);
}

export async function signOutGuideUser() {
  const client = await createAuthenticatedServerClient();
  await client?.auth.signOut();
  redirect("/");
}
