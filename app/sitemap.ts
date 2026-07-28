import type { MetadataRoute } from "next";
import { businesses, categories } from "@/lib/fixtures";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...categories.map(({ slug }) => ({
      url: `${base}/categorias/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...businesses.map(({ slug }) => ({
      url: `${base}/empresas/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  ];
}
