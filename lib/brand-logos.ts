import type { Brand } from "@/lib/types";
import { brandToSlug } from "@/lib/seo/site";

/** مسیر لوگوهای برند در public */
export const BRAND_LOGO_PATHS: Record<Brand, string> = {
  Adidas: "/images/brands/Adidas-Logo.svg",
  Nike: "/images/brands/Nike-Logo.svg",
  "On Running": "/images/brands/on-running.svg",
  ASICS: "/images/brands/Asics-Logo.svg",
  Hoka: "/images/brands/hoka-seeklogo.png",
  "New Balance": "/images/brands/New-Balance-Logo.svg",
  Saucony: "/images/brands/saucony-seeklogo.png",
  Brooks: "/images/brands/brooks-sports-seeklogo.svg",
};

export function getBrandLogoPath(brand: Brand): string {
  return BRAND_LOGO_PATHS[brand] ?? `/images/brands/${brandToSlug(brand)}.svg`;
}
