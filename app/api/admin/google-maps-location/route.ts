import { NextResponse } from "next/server";
import { resolveGoogleMapsLocation } from "@/lib/google-maps";
import { requireAdmin } from "@/lib/supabase/auth-server";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = (await request.json()) as { url?: unknown };
    if (typeof body.url !== "string")
      return NextResponse.json({ error: "Informe o link do Google Maps." }, { status: 400 });
    const location = await resolveGoogleMapsLocation(body.url.trim());
    return NextResponse.json({ location });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível importar a localização.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
