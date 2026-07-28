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
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  categorySlugs: string[];
  neighborhood: string;
  city: string;
  imageUrl: string;
  imageAlt: string;
  latitude: number;
  longitude: number;
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
