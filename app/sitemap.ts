import type { MetadataRoute } from "next";
import { listActiveCategories, listRecentBusinesses } from "@/lib/data/directory";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://guiavempratorres.vercel.app";
  const [categories, businesses] = await Promise.all([
    listActiveCategories(),
    listRecentBusinesses(1000)
  ]);
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/buscar`, changeFrequency: "weekly", priority: 0.6 },
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
    }))
  ];
}
