import type { ProductCreateBody } from "@/types/product.api";
import type { Product } from "@/lib/types";

export type ProductUpsertPayload = ProductCreateBody;

export type ProductFormState = {
  slug: string;
  name: string;
  brand: Product["brand"];
  category: Product["category"];
  gender: Product["gender"];
  price: string;
  originalPrice: string;
  discount: string;
  sizes: string;
  unavailableSizes: string;
  footType: Product["footType"];
  surface: Product["surface"];
  drop: string;
  weight: string;
  stackHeight: string;
  isNew: boolean;
  isBestseller: boolean;
  description: string;
  tags: string;
  images: string[];
  videos: string[];
};

export const emptyProductForm = (): ProductFormState => ({
  slug: "",
  name: "",
  brand: "Nike",
  category: "running",
  gender: "unisex",
  price: "",
  originalPrice: "",
  discount: "",
  sizes: "38, 39, 40, 41, 42",
  unavailableSizes: "",
  footType: ["normal"],
  surface: ["road"],
  drop: "10",
  weight: "250",
  stackHeight: "",
  isNew: false,
  isBestseller: false,
  description: "",
  tags: "",
  images: [],
  videos: [],
});

export function productToForm(product: Product): ProductFormState {
  return {
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    gender: product.gender,
    price: String(product.price),
    originalPrice: product.originalPrice ? String(product.originalPrice) : "",
    discount: product.discount ? String(product.discount) : "",
    sizes: product.sizes.join(", "),
    unavailableSizes: (product.unavailableSizes ?? []).join(", "),
    footType: [...product.footType],
    surface: [...product.surface],
    drop: String(product.drop),
    weight: String(product.weight),
    stackHeight: product.stackHeight ? String(product.stackHeight) : "",
    isNew: product.isNew,
    isBestseller: product.isBestseller,
    description: product.description,
    tags: product.tags.join(", "),
    images: [...product.images],
    videos: [...(product.videos ?? [])],
  };
}

function parseNumbers(csv: string): number[] {
  return csv
    .split(/[,،\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

export function formToPayload(form: ProductFormState): ProductUpsertPayload {
  const images = form.images.map((s) => s.trim()).filter(Boolean);
  const videos = form.videos.map((s) => s.trim()).filter(Boolean);

  const payload: ProductCreateBody = {
    slug: form.slug.trim(),
    name: form.name.trim(),
    brand: form.brand,
    category: form.category,
    gender: form.gender,
    price: Number(form.price),
    sizes: parseNumbers(form.sizes),
    footType: form.footType,
    surface: form.surface,
    drop: Number(form.drop),
    weight: Number(form.weight),
    isNew: form.isNew,
    isBestseller: form.isBestseller,
    images,
    videos: videos.length ? videos : undefined,
    description: form.description.trim(),
    tags: form.tags
      .split(/[,،]/)
      .map((t) => t.trim())
      .filter(Boolean),
  };

  if (form.originalPrice) payload.originalPrice = Number(form.originalPrice);
  if (form.discount) payload.discount = Number(form.discount);
  if (form.unavailableSizes) {
    payload.unavailableSizes = parseNumbers(form.unavailableSizes);
  }
  if (form.stackHeight) payload.stackHeight = Number(form.stackHeight);

  return payload;
}

export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-");
}
