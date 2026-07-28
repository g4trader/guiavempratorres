export type Category = {
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type BusinessItemType = "PRODUCT" | "SERVICE" | "PROMOTION" | "MENU" | "CATALOG";

export type BusinessItem = {
  id: string;
  title: string;
  type: BusinessItemType;
  description: string;
  image: string | null;
  price?: number;
  ctaLabel: string | null;
  ctaUrl: string | null;
};

export type Business = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  categorySlugs: string[];
  neighborhood: string;
  city: string;
  addressLine: string;
  imageUrl: string;
  imageAlt: string;
  logoUrl: string | null;
  gallery: { id: string; url: string; alt: string }[];
  premium: boolean;
  featuredHome: boolean;
  featuredCategory: boolean;
  planPriority: number;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  websiteUrl: string | null;
  instagramUrl: string | null;
  items: BusinessItem[];
};

export type SearchResult = {
  id: string;
  kind: "business" | "category" | "item";
  title: string;
  description: string;
  href: string;
  context: string;
};

export const isHeroCapacityAvailable = (activeCount: number) =>
  Number.isInteger(activeCount) && activeCount >= 0 && activeCount < 5;

export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
