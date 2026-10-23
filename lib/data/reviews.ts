"use client";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
export async function loadBusinessReviews(businessId: string, offset: number, limit: number) {
  return createBrowserSupabaseClient().rpc("get_public_business_reviews", {
    p_business_id: businessId,
    p_offset: offset,
    p_limit: limit
  });
}
