export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://drshoes.ir";

export const SITE_NAME = "دکتر شوز";
export const SITE_NAME_EN = "Dr.Shoes Running";

export const SITE_DESCRIPTION =
  "خرید کفش رانینگ اورجینال آدیداس، نایک، On Running، ASICS، Hoka با پرداخت کارت به کارت و ارسال سریع. بهترین قیمت کفش دویدن در ایران.";

export const SITE_KEYWORDS = [
  "کفش رانینگ",
  "کفش دویدن",
  "کفش ورزشی اورجینال",
  "آدیداس",
  "نایک",
  "On Running",
  "خرید کفش رانینگ",
  "کفش رانینگ اورجینال",
  "فروشگاه کفش دویدن",
];

export const INSTAGRAM_URL = "https://www.instagram.com/dr.shoes.run1";
export const OG_IMAGE_PATH = "/images/brands/Hero Baner3.png";

export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function brandToSlug(brand: string): string {
  return brand
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function productPath(slug: string): string {
  return `/products/${slug}`;
}

export function categoryPath(slug: string): string {
  return `/category/${slug}`;
}

export function brandPath(brand: string): string {
  return `/brand/${brandToSlug(brand)}`;
}

export function productImageAlt(product: {
  name: string;
  brand: string;
  category?: string;
}): string {
  const categoryLabel =
    product.category === "running"
      ? "رانینگ"
      : product.category === "trail"
        ? "تریل"
        : product.category === "race"
          ? "مسابقه"
          : "دویدن";
  return `کفش ${categoryLabel} ${product.brand} ${product.name}`;
}
