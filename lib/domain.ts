export type Category = {
  id: string;
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
  featuredHomeSelected: boolean;
  featuredHomeOrder: number;
  featuredHomeStartsAt: string | null;
  featuredHomeEndsAt: string | null;
  featuredCategory: boolean;
  planPriority: number;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  websiteUrl: string | null;
  instagramUrl: string | null;
  ratingAverage: number;
  ratingCount: number;
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

export function seededShuffle<T>(values: T[], seed: string): T[] {
  let state = 2166136261;
  for (const character of seed) {
    state ^= character.charCodeAt(0);
    state = Math.imul(state, 16777619);
  }
  const random = () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
