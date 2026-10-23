import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://guiavempratorres.vercel.app";
  return {
    rules:
      process.env.VERCEL_ENV === "preview"
        ? [{ userAgent: "*", disallow: "/" }]
        : [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${base}/sitemap.xml`
  };
}
