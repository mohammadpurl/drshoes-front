import { getProductImages } from "@/lib/product-images";
import type { Product } from "@/lib/types";

const PLACEHOLDER_HOSTS = [
  "images.unsplash.com",
  "unsplash.com",
  "picsum.photos",
  "placehold.co",
  "via.placeholder.com",
];

/** آدرس‌های placeholder یا غیرقابل‌دسترس (مثلاً Unsplash در ایران) */
export function isPlaceholderImageUrl(url: string): boolean {
  const value = url?.trim();
  if (!value) return true;

  if (value.startsWith("/images/Products")) return false;
  if (value.includes("/static/products/")) return false;
  if (value.includes("/api/v1/media/")) return false;

  try {
    const { hostname } = new URL(value);
    return PLACEHOLDER_HOSTS.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

function resolveImages(slug: string, productId: string, images: string[]): string[] {
  const list = images.filter(Boolean);
  const needsReplace =
    list.length === 0 || list.some((url) => isPlaceholderImageUrl(url));

  if (!needsReplace) return list;
  return getProductImages(slug, productId);
}

/** جایگزینی تصاویر placeholder با فایل‌های محلی public/images/Products */
export function normalizeProduct(product: Product): Product {
  return {
    ...product,
    images: resolveImages(product.slug, product.id, product.images ?? []),
  };
}

export function normalizeProducts(products: Product[]): Product[] {
  return products.map(normalizeProduct);
}
