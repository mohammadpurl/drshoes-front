"use client";

import Image, { type ImageProps } from "next/image";
import { isPlaceholderImageUrl } from "@/lib/normalize-product";
import { shouldUseUnoptimizedImage } from "@/lib/media-url";
import { getProductImages } from "@/lib/product-images";

type ProductImageProps = Omit<ImageProps, "src"> & {
  src: string;
  slug?: string;
  productId?: string;
};

function resolveSrc(src: string, slug?: string, productId?: string): string {
  if (!isPlaceholderImageUrl(src)) return src;
  if (slug && productId) {
    return getProductImages(slug, productId)[0] ?? src;
  }
  return src;
}

/** تصویر محصول — از Unsplash عبور نمی‌کند؛ مسیرهای محلی unoptimized هستند. */
export function ProductImage({
  src,
  slug,
  productId,
  unoptimized,
  ...props
}: ProductImageProps) {
  const resolved = resolveSrc(src, slug, productId);

  return (
    <Image
      src={resolved}
      unoptimized={unoptimized ?? shouldUseUnoptimizedImage(resolved)}
      {...props}
    />
  );
}
