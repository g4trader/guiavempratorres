import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { getPublicSupabaseConfig } from "@/lib/env";

export function createPublicServerClient(): SupabaseClient<Database> | null {
  const config = getPublicSupabaseConfig();
  if (!config) return null;

  return createClient<Database>(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    }
  );
}
