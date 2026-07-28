import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Database } from "@/lib/database.types";
import { getPublicSupabaseConfig } from "@/lib/env";
import type { AdminRole } from "@/lib/auth/authorization";

export async function createAuthenticatedServerClient() {
  const config = getPublicSupabaseConfig();
  if (!config) return null;

  const cookieStore = await cookies();
  return createServerClient<Database>(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (values) => {
          try {
            values.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Components cannot persist refreshed cookies.
          }
        }
      }
    }
  );
}

export async function requireAdmin() {
  const client = await createAuthenticatedServerClient();
  if (!client) redirect("/admin?erro=configuracao");

  const {
    data: { user }
  } = await client.auth.getUser();
  if (!user) redirect("/admin?erro=login");

  const { data: membership } = await client
    .from("admin_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership) redirect("/admin?erro=permissao");

  return { client, user, role: membership.role as AdminRole };
}
