export type Category = {
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
};

export type ProductService = {
  name: string;
  type: "product" | "service";
  description: string;
  price?: number;
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
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  websiteUrl: string | null;
  instagramUrl: string | null;
  products: ProductService[];
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
