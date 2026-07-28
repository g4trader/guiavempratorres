import { createPublicServerClient } from "@/lib/supabase/server";
import { businesses as demoBusinesses, categories as demoCategories } from "@/lib/fixtures";
import { getPublicSupabaseConfig } from "@/lib/env";
import { parseSlug } from "@/lib/validation/slugs";
import type { Business, BusinessItem, Category } from "@/lib/domain";

export type HeroCampaign = {
  id: string;
  title: string;
  description: string;
  imageDesktop: string;
  imageMobile: string | null;
  imageAlt: string;
  internalPath: string;
  businessName: string;
};

const demoHero: HeroCampaign[] = demoBusinesses.slice(0, 3).map((business, index) => ({
  id: `demo-${index + 1}`,
  title: business.name,
  description: business.shortDescription,
  imageDesktop: "/placeholders/hero-desktop.svg",
  imageMobile: "/placeholders/hero-mobile.svg",
  imageAlt: `Placeholder fictício de ${business.name}`,
  internalPath: `/empresas/${business.slug}`,
  businessName: business.name
}));

function resolvePublicAsset(path: string | null): string | null {
  if (!path || path.startsWith("/") || path.startsWith("https://")) return path;
  const config = getPublicSupabaseConfig();
  return config
    ? `${config.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`
    : `/${path}`;
}

function mapCategory(row: {
  slug: string;
  name: string;
  description: string | null;
  image_path: string | null;
  image_alt: string | null;
}): Category {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    imageUrl: resolvePublicAsset(row.image_path) ?? "/placeholders/hero-desktop.svg",
    imageAlt: row.image_alt ?? `Imagem ilustrativa de ${row.name}`
  };
}

function mapBusiness(
  row: {
    id: string;
    slug: string;
    name: string;
    short_description: string | null;
    description: string | null;
    hero_image_path: string | null;
    hero_image_alt: string | null;
    neighborhood: string | null;
    city: string;
    address_line: string | null;
    latitude: number | null;
    longitude: number | null;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    website_url: string | null;
    instagram_url: string | null;
  },
  categorySlugs: string[] = [],
  items: BusinessItem[] = []
): Business {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
    categorySlugs,
    neighborhood: row.neighborhood ?? "",
    city: row.city,
    addressLine: row.address_line ?? "",
    imageUrl: resolvePublicAsset(row.hero_image_path) ?? "/placeholders/hero-desktop.svg",
    imageAlt: row.hero_image_alt ?? `Imagem ilustrativa de ${row.name}`,
    latitude: row.latitude,
    longitude: row.longitude,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    websiteUrl: row.website_url,
    instagramUrl: row.instagram_url,
    items
  };
}

export async function listActiveCategories(): Promise<Category[]> {
  const client = createPublicServerClient();
  if (!client) return demoCategories;

  const { data, error } = await client
    .from("categories")
    .select("slug,name,description,image_path,image_alt")
    .eq("is_active", true)
    .order("display_order");

  if (error) throw new Error("Não foi possível carregar as categorias.");
  return data.map(mapCategory);
}

export async function getActiveCategoryBySlug(slugValue: string): Promise<Category | null> {
  const slug = parseSlug(slugValue);
  const client = createPublicServerClient();
  if (!client) return demoCategories.find((category) => category.slug === slug) ?? null;

  const { data, error } = await client
    .from("categories")
    .select("slug,name,description,image_path,image_alt")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new Error("Não foi possível carregar a categoria.");
  return data ? mapCategory(data) : null;
}

export async function listPublishedBusinessesByCategory(
  categorySlugValue: string
): Promise<Business[]> {
  const categorySlug = parseSlug(categorySlugValue);
  const client = createPublicServerClient();
  if (!client) {
    return demoBusinesses.filter((business) => business.categorySlugs.includes(categorySlug));
  }

  const { data: category, error: categoryError } = await client
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .eq("is_active", true)
    .maybeSingle();
  if (categoryError || !category) return [];

  const { data: relations, error: relationError } = await client
    .from("business_categories")
    .select("business_id")
    .eq("category_id", category.id);
  if (relationError || relations.length === 0) return [];

  const { data, error } = await client
    .from("businesses")
    .select(
      "id,slug,name,short_description,description,hero_image_path,hero_image_alt,neighborhood,city,address_line,latitude,longitude,phone,whatsapp,email,website_url,instagram_url"
    )
    .in(
      "id",
      relations.map(({ business_id }) => business_id)
    )
    .eq("status", "published")
    .order("name");
  if (error) throw new Error("Não foi possível carregar as empresas.");

  return data.map((row) => mapBusiness(row, [categorySlug]));
}

export async function listActiveBusinessItems(businessId: string): Promise<BusinessItem[]> {
  const client = createPublicServerClient();
  if (!client) return [];

  const { data, error } = await client
    .from("business_items")
    .select("id,title,type,description,image,price,cta_label,cta_url")
    .eq("business_id", businessId)
    .eq("active", true)
    .order("display_order");
  if (error) throw new Error("Não foi possível carregar os itens da empresa.");

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    type: item.type,
    description: item.description ?? "",
    image: resolvePublicAsset(item.image),
    price: item.price ?? undefined,
    ctaLabel: item.cta_label,
    ctaUrl: item.cta_url
  }));
}

export async function getPublishedBusinessBySlug(slugValue: string): Promise<Business | null> {
  const slug = parseSlug(slugValue);
  const client = createPublicServerClient();
  if (!client) return demoBusinesses.find((business) => business.slug === slug) ?? null;

  const { data, error } = await client
    .from("businesses")
    .select(
      "id,slug,name,short_description,description,hero_image_path,hero_image_alt,neighborhood,city,address_line,latitude,longitude,phone,whatsapp,email,website_url,instagram_url"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error("Não foi possível carregar a empresa.");
  if (!data) return null;

  const items = await listActiveBusinessItems(data.id);
  return mapBusiness(data, [], items);
}

export async function getValidHomeHeroCampaigns(): Promise<HeroCampaign[]> {
  const client = createPublicServerClient();
  if (!client) return demoHero;

  const now = new Date().toISOString();
  const { data: placement, error: placementError } = await client
    .from("ad_placements")
    .select("id,maximum_active_ads")
    .eq("code", "HOME_HERO")
    .eq("is_active", true)
    .maybeSingle();
  if (placementError || !placement) return [];

  const { data: campaigns, error: campaignsError } = await client
    .from("ad_campaigns")
    .select("id,business_id,internal_path")
    .eq("placement_id", placement.id)
    .eq("status", "active")
    .lte("starts_at", now)
    .gt("ends_at", now)
    .order("priority", { ascending: false })
    .order("display_order")
    .limit(Math.min(placement.maximum_active_ads, 5));
  if (campaignsError || campaigns.length === 0) return [];

  const campaignIds = campaigns.map(({ id }) => id);
  const businessIds = campaigns.map(({ business_id }) => business_id);
  const [{ data: creatives, error: creativesError }, { data: businesses, error: businessesError }] =
    await Promise.all([
      client
        .from("ad_creatives")
        .select("campaign_id,desktop_image_path,mobile_image_path,image_alt,title,description")
        .in("campaign_id", campaignIds),
      client.from("businesses").select("id,name").in("id", businessIds).eq("status", "published")
    ]);
  if (creativesError || businessesError) throw new Error("Não foi possível carregar o hero.");

  return campaigns.flatMap((campaign) => {
    const creative = creatives.find((item) => item.campaign_id === campaign.id);
    const business = businesses.find((item) => item.id === campaign.business_id);
    if (!creative || !business) return [];
    return [
      {
        id: campaign.id,
        title: creative.title ?? business.name,
        description: creative.description ?? "",
        imageDesktop: creative.desktop_image_path,
        imageMobile: creative.mobile_image_path,
        imageAlt: creative.image_alt,
        internalPath: campaign.internal_path,
        businessName: business.name
      }
    ];
  });
}
