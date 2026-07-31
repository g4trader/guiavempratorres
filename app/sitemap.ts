import type { MetadataRoute } from "next";
import { listActiveCategories, listRecentBusinesses } from "@/lib/data/directory";
import { listPublishedTouristAttractions } from "@/lib/data/tourist-attractions";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://guiavempratorres.vercel.app";
  const [categories, businesses, attractions] = await Promise.all([
    listActiveCategories(),
    listRecentBusinesses(1000),
    listPublishedTouristAttractions()
  ]);
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/buscar`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/pontos-turisticos`, changeFrequency: "weekly", priority: 0.8 },
    ...categories.map(({ slug }) => ({
      url: `${base}/categorias/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...businesses.map(({ slug, publishedAt }) => ({
      url: `${base}/empresas/${slug}`,
      lastModified: publishedAt ? new Date(publishedAt) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7
    })),
    ...attractions.map(({ slug }) => ({
      url: `${base}/pontos-turisticos/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7
    }))
  ];
}
