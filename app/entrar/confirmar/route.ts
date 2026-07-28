import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createAuthenticatedServerClient } from "@/lib/supabase/auth-server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const requested = request.nextUrl.searchParams.get("retorno") ?? "/";
  const destination = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";
  const client = await createAuthenticatedServerClient();

  if (code && client) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.redirect(new URL("/entrar?erro=confirmacao", request.url));
}
