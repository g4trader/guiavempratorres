import { createPublicServerClient } from "@/lib/supabase/server";
import { getPublicSupabaseConfig } from "@/lib/env";
import { parseSlug } from "@/lib/validation/slugs";
import type { Business, BusinessItem, Category, SearchResult } from "@/lib/domain";

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

type BusinessRow = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  logo_path: string | null;
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
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  plans:
    | {
        premium_badge: boolean;
        featured_home: boolean;
        featured_category: boolean;
        priority: number;
      }
    | {
        premium_badge: boolean;
        featured_home: boolean;
        featured_category: boolean;
        priority: number;
      }[]
    | null;
};

const businessSelect =
  "id,slug,name,short_description,description,logo_path,hero_image_path,hero_image_alt,neighborhood,city,address_line,latitude,longitude,phone,whatsapp,email,website_url,instagram_url,published_at,seo_title,seo_description,plans(premium_badge,featured_home,featured_category,priority)";

export function resolvePublicAsset(path: string | null): string | null {
  if (!path || path.startsWith("/") || path.startsWith("https://")) return path;
  const config = getPublicSupabaseConfig();
  return config ? `${config.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}` : null;
}

function mapCategory(row: {
  slug: string;
  name: string;
  description: string | null;
  image_path: string | null;
  image_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
}): Category {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    imageUrl: resolvePublicAsset(row.image_path) ?? "/placeholders/hero-desktop.svg",
    imageAlt: row.image_alt ?? `Imagem de ${row.name}`,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description
  };
}

function getPlan(row: BusinessRow) {
  return Array.isArray(row.plans) ? row.plans[0] : row.plans;
}

function mapBusiness(
  row: BusinessRow,
  options: {
    categorySlugs?: string[];
    items?: BusinessItem[];
    gallery?: Business["gallery"];
  } = {}
): Business {
  const plan = getPlan(row);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
    categorySlugs: options.categorySlugs ?? [],
    neighborhood: row.neighborhood ?? "",
    city: row.city,
    addressLine: row.address_line ?? "",
    imageUrl: resolvePublicAsset(row.hero_image_path) ?? "/placeholders/hero-desktop.svg",
    imageAlt: row.hero_image_alt ?? `Imagem de ${row.name}`,
    logoUrl: resolvePublicAsset(row.logo_path),
    gallery: options.gallery ?? [],
    premium: plan?.premium_badge ?? false,
    featuredHome: plan?.featured_home ?? false,
    featuredCategory: plan?.featured_category ?? false,
    planPriority: plan?.priority ?? 0,
    publishedAt: row.published_at,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    latitude: row.latitude,
    longitude: row.longitude,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    websiteUrl: row.website_url,
    instagramUrl: row.instagram_url,
    items: options.items ?? []
  };
}

function sortCommercialPriority(businesses: Business[], category = false) {
  return businesses.sort((a, b) => {
    if (a.premium !== b.premium) return a.premium ? -1 : 1;
    const aFeatured = category ? a.featuredCategory : a.featuredHome;
    const bFeatured = category ? b.featuredCategory : b.featuredHome;
    if (aFeatured !== bFeatured) return aFeatured ? -1 : 1;
    return b.planPriority - a.planPriority || a.name.localeCompare(b.name, "pt-BR");
  });
}

export async function listActiveCategories(): Promise<Category[]> {
  const client = createPublicServerClient();
  if (!client) return [];
  const { data, error } = await client
    .from("categories")
    .select("slug,name,description,image_path,image_alt,seo_title,seo_description")
    .eq("is_active", true)
    .order("display_order");
  if (error) throw new Error("Não foi possível carregar as categorias.");
  return data.map(mapCategory);
}

export async function getActiveCategoryBySlug(slugValue: string): Promise<Category | null> {
  const client = createPublicServerClient();
  if (!client) return null;
  const { data, error } = await client
    .from("categories")
    .select("slug,name,description,image_path,image_alt,seo_title,seo_description")
    .eq("slug", parseSlug(slugValue))
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw new Error("Não foi possível carregar a categoria.");
  return data ? mapCategory(data) : null;
}

async function listPublishedBusinessRows(ids?: string[]): Promise<Business[]> {
  const client = createPublicServerClient();
  if (!client || ids?.length === 0) return [];
  let query = client.from("businesses").select(businessSelect).eq("status", "published");
  if (ids) query = query.in("id", ids);
  const { data, error } = await query;
  if (error) throw new Error("Não foi possível carregar as empresas.");
  return (data as unknown as BusinessRow[]).map((row) => mapBusiness(row));
}

export async function listFeaturedBusinesses(limit = 6): Promise<Business[]> {
  const businesses = await listPublishedBusinessRows();
  return sortCommercialPriority(businesses)
    .filter((business) => business.featuredHome)
    .slice(0, limit);
}

export async function listRecentBusinesses(limit = 6): Promise<Business[]> {
  const businesses = await listPublishedBusinessRows();
  return businesses
    .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime())
    .slice(0, limit);
}

export async function listPublishedBusinessesByCategory(
  categorySlugValue: string,
  page = 1,
  pageSize = 9,
  order = "priority"
): Promise<{ businesses: Business[]; total: number; totalPages: number }> {
  const client = createPublicServerClient();
  if (!client) return { businesses: [], total: 0, totalPages: 0 };
  const categorySlug = parseSlug(categorySlugValue);
  const { data: category } = await client
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .eq("is_active", true)
    .maybeSingle();
  if (!category) return { businesses: [], total: 0, totalPages: 0 };
  const { data: relations, error } = await client
    .from("business_categories")
    .select("business_id")
    .eq("category_id", category.id);
  if (error) throw new Error("Não foi possível carregar a categoria.");
  const businesses = (await listPublishedBusinessRows(relations.map((row) => row.business_id))).map(
    (business) => ({ ...business, categorySlugs: [categorySlug] })
  );
  const sorted =
    order === "recent"
      ? businesses.sort(
          (a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
        )
      : order === "name"
        ? businesses.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
        : sortCommercialPriority(businesses, true);
  const safePage = Math.max(1, page);
  return {
    businesses: sorted.slice((safePage - 1) * pageSize, safePage * pageSize),
    total: sorted.length,
    totalPages: Math.ceil(sorted.length / pageSize)
  };
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
  const client = createPublicServerClient();
  if (!client) return null;
  const { data, error } = await client
    .from("businesses")
    .select(businessSelect)
    .eq("slug", parseSlug(slugValue))
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error("Não foi possível carregar a empresa.");
  if (!data) return null;
  const businessRow = data as unknown as BusinessRow;
  const [{ data: media, error: mediaError }, items] = await Promise.all([
    client
      .from("business_media")
      .select("id,storage_path,image_alt")
      .eq("business_id", businessRow.id)
      .eq("kind", "gallery")
      .eq("is_active", true)
      .order("display_order"),
    listActiveBusinessItems(businessRow.id)
  ]);
  if (mediaError) throw new Error("Não foi possível carregar a galeria.");
  return mapBusiness(businessRow, {
    items,
    gallery: media.map((item) => ({
      id: item.id,
      url: resolvePublicAsset(item.storage_path) ?? "",
      alt: item.image_alt
    }))
  });
}

export async function searchDirectory(rawQuery: string): Promise<SearchResult[]> {
  const query = rawQuery.trim().slice(0, 80);
  const client = createPublicServerClient();
  if (!client || query.length < 2) return [];
  const pattern = `%${query.replaceAll("%", "\\%").replaceAll(",", " ")}%`;
  const [businessesResult, categoriesResult, itemsResult] = await Promise.all([
    client
      .from("businesses")
      .select("id,slug,name,short_description,city,neighborhood")
      .eq("status", "published")
      .or(
        `name.ilike.${pattern},short_description.ilike.${pattern},description.ilike.${pattern},city.ilike.${pattern},neighborhood.ilike.${pattern}`
      )
      .limit(20),
    client
      .from("categories")
      .select("id,slug,name,description")
      .eq("is_active", true)
      .or(`name.ilike.${pattern},description.ilike.${pattern}`)
      .limit(10),
    client
      .from("business_items")
      .select("id,title,description,businesses!inner(slug,name,city,neighborhood)")
      .eq("active", true)
      .or(`title.ilike.${pattern},description.ilike.${pattern}`)
      .limit(20)
  ]);
  if (businessesResult.error || categoriesResult.error || itemsResult.error)
    throw new Error("Não foi possível realizar a busca.");
  return [
    ...businessesResult.data.map((row) => ({
      id: row.id,
      kind: "business" as const,
      title: row.name,
      description: row.short_description ?? "",
      href: `/empresas/${row.slug}`,
      context: [row.neighborhood, row.city].filter(Boolean).join(", ")
    })),
    ...categoriesResult.data.map((row) => ({
      id: row.id,
      kind: "category" as const,
      title: row.name,
      description: row.description ?? "",
      href: `/categorias/${row.slug}`,
      context: "Categoria"
    })),
    ...itemsResult.data.map((row) => {
      const business = Array.isArray(row.businesses) ? row.businesses[0] : row.businesses;
      return {
        id: row.id,
        kind: "item" as const,
        title: row.title,
        description: row.description ?? "",
        href: `/empresas/${business.slug}`,
        context: `${business.name} · ${[business.neighborhood, business.city].filter(Boolean).join(", ")}`
      };
    })
  ];
}

export async function getValidHomeHeroCampaigns(): Promise<HeroCampaign[]> {
  const client = createPublicServerClient();
  if (!client) return [];
  const now = new Date().toISOString();
  const { data: placement } = await client
    .from("ad_placements")
    .select("id,maximum_active_ads")
    .eq("code", "HOME_HERO")
    .eq("is_active", true)
    .maybeSingle();
  if (!placement) return [];
  const { data: campaigns, error } = await client
    .from("ad_campaigns")
    .select("id,business_id,internal_path")
    .eq("placement_id", placement.id)
    .eq("status", "active")
    .lte("starts_at", now)
    .gt("ends_at", now)
    .order("priority", { ascending: false })
    .order("display_order")
    .limit(Math.min(placement.maximum_active_ads, 5));
  if (error || campaigns.length === 0) return [];
  const [{ data: creatives }, { data: businesses }] = await Promise.all([
    client
      .from("ad_creatives")
      .select("campaign_id,desktop_image_path,mobile_image_path,image_alt,title,description")
      .in(
        "campaign_id",
        campaigns.map(({ id }) => id)
      ),
    client
      .from("businesses")
      .select("id,name")
      .in(
        "id",
        campaigns.map(({ business_id }) => business_id)
      )
      .eq("status", "published")
  ]);
  return campaigns.flatMap((campaign) => {
    const creative = creatives?.find((item) => item.campaign_id === campaign.id);
    const business = businesses?.find((item) => item.id === campaign.business_id);
    if (!creative || !business) return [];
    return [
      {
        id: campaign.id,
        title: creative.title ?? business.name,
        description: creative.description ?? "",
        imageDesktop: resolvePublicAsset(creative.desktop_image_path) ?? "",
        imageMobile: resolvePublicAsset(creative.mobile_image_path),
        imageAlt: creative.image_alt,
        internalPath: campaign.internal_path,
        businessName: business.name
      }
    ];
  });
}
