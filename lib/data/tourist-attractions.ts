import { createPublicServerClient } from "@/lib/supabase/server";
import { parseSlug } from "@/lib/validation/slugs";
import { resolvePublicAsset } from "@/lib/data/directory";
import type { TouristAttraction, TouristAttractionBlock } from "@/lib/domain";

type TouristAttractionRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  card_image_path: string | null;
  card_image_alt: string | null;
  content_blocks: unknown;
  google_maps_url: string | null;
  address_line: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  seo_title: string | null;
  seo_description: string | null;
};

const selection =
  "id,title,slug,excerpt,card_image_path,card_image_alt,content_blocks,google_maps_url,address_line,neighborhood,city,state,postal_code,latitude,longitude,seo_title,seo_description";

function mapAttraction(row: TouristAttractionRow): TouristAttraction {
  const contentBlocks = Array.isArray(row.content_blocks)
    ? (row.content_blocks as TouristAttractionBlock[])
    : [];
  const firstContentImage = contentBlocks.find((block) => block.type === "IMAGE");
  const cardImagePath = row.card_image_path ?? firstContentImage?.imagePath ?? null;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    cardImageUrl: resolvePublicAsset(cardImagePath) ?? "/placeholders/hero-desktop.svg",
    cardImageAlt: row.card_image_alt ?? firstContentImage?.imageAlt ?? `Imagem de ${row.title}`,
    contentBlocks,
    googleMapsUrl: row.google_maps_url,
    addressLine: row.address_line ?? "",
    neighborhood: row.neighborhood ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    postalCode: row.postal_code ?? "",
    latitude: row.latitude,
    longitude: row.longitude,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description
  };
}

export async function listPublishedTouristAttractions(): Promise<TouristAttraction[]> {
  const client = createPublicServerClient();
  if (!client) return [];
  const { data, error } = await client
    .from("tourist_attractions")
    .select(selection)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw new Error("Não foi possível carregar os pontos turísticos.");
  return (data as unknown as TouristAttractionRow[]).map(mapAttraction);
}

export async function getPublishedTouristAttractionBySlug(
  slugValue: string
): Promise<TouristAttraction | null> {
  const client = createPublicServerClient();
  if (!client) return null;
  const slug = parseSlug(slugValue);
  const { data, error } = await client
    .from("tourist_attractions")
    .select(selection)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error("Não foi possível carregar o ponto turístico.");
  return data ? mapAttraction(data as unknown as TouristAttractionRow) : null;
}
