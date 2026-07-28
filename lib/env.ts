import { z } from "zod";

const publicSupabaseSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(20)
});

export type PublicSupabaseConfig = z.infer<typeof publicSupabaseSchema>;

export function getPublicSupabaseConfig(): PublicSupabaseConfig | null {
  const parsed = publicSupabaseSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  });

  return parsed.success ? parsed.data : null;
}

export function getDataMode(): "supabase-cloud" | "demo" {
  return getPublicSupabaseConfig() ? "supabase-cloud" : "demo";
}
