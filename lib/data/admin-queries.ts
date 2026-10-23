import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
type Client = SupabaseClient<Database>;

export async function loadCampaignEditor(client: Client) {
  return await Promise.all([
    client.from("ad_campaigns").select("*").order("starts_at", { ascending: false }),
    client.from("businesses").select("id,name,slug").order("name"),
    client.from("ad_placements").select("id,name,code").order("name"),
    client.from("ad_creatives").select("*"),
    client.from("categories").select("id,name").eq("is_active", true).order("name"),
    client.from("ad_campaign_categories").select("campaign_id,category_id")
  ]);
}

export async function loadBusinessEditor(client: Client) {
  return await Promise.all([
    client.from("businesses").select("*").order("name"),
    client.from("plans").select("id,name").order("priority", { ascending: false }),
    client.from("categories").select("id,name").order("display_order"),
    client.from("business_categories").select("business_id,category_id"),
    client.from("business_media").select("*").eq("kind", "gallery").order("display_order"),
    client.from("business_items").select("*").order("display_order")
  ]);
}

export async function loadItemEditor(client: Client, search: string, type: string) {
  return await Promise.all([
    client.from("businesses").select("id,name").order("name"),
    (() => {
      let query = client.from("business_items").select("*,businesses(name)").order("display_order");
      if (search) query = query.ilike("title", `%${search}%`);
      if (["PRODUCT", "SERVICE", "PROMOTION", "MENU", "CATALOG"].includes(type)) {
        query = query.eq("type", type as "PRODUCT" | "SERVICE" | "PROMOTION" | "MENU" | "CATALOG");
      }
      return query;
    })()
  ]);
}

export async function loadDashboard(adminClient: Client) {
  return await Promise.all([
    adminClient.from("plans").select("*", { count: "exact", head: true }),
    adminClient.from("categories").select("*", { count: "exact", head: true }),
    adminClient.from("tourist_attractions").select("*", { count: "exact", head: true }),
    adminClient.from("businesses").select("*", { count: "exact", head: true }),
    adminClient.from("ad_campaigns").select("*", { count: "exact", head: true }),
    adminClient.from("profiles").select("*", { count: "exact", head: true })
  ]);
}

export async function loadPlans(client: Client) {
  return client.from("plans").select("*").order("priority", {
    ascending: false
  });
}

export async function loadCategories(client: Client) {
  return client.from("categories").select("*").order("display_order");
}

export async function loadAttractions(client: Client) {
  return client.from("tourist_attractions").select("*").order("title");
}

export async function loadUsers(client: Client) {
  return client.from("profiles").select("id,display_name,admin_roles(role)").order("display_name");
}

export async function getAdminMembership(client: Client, userId: string) {
  return client.from("admin_roles").select("role").eq("user_id", userId).maybeSingle();
}

export async function getUserRating(client: Client, businessId: string, userId: string) {
  return client
    .from("business_ratings")
    .select("rating,comment")
    .eq("business_id", businessId)
    .eq("user_id", userId)
    .maybeSingle();
}
