import type { Metadata } from "next";
import {
  OG_IMAGE_PATH,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_NAME_EN,
  SITE_URL,
  absoluteUrl,
  productImageAlt,
  productPath,
} from "@/lib/seo/site";
import type { Product } from "@/lib/types";

const ogImage = {
  url: OG_IMAGE_PATH,
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "دکتر شوز | فروشگاه آنلاین کفش رانینگ اورجینال",
    template: "%s | دکتر شوز",
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME_EN }],
  creator: SITE_NAME_EN,
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "دکتر شوز | فروشگاه آنلاین کفش رانینگ اورجینال",
    description: SITE_DESCRIPTION,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "دکتر شوز | کفش رانینگ اورجینال",
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
    languages: { "fa-IR": SITE_URL },
  },
  other: {
    "hreflang": "fa-IR",
  },
};

export function buildProductMetadata(product: Product): Metadata {
  const path = productPath(product.slug);
  const url = absoluteUrl(path);
  const title = `خرید ${product.name} ${product.brand} اورجینال`;
  const description =
    product.description.length >= 120
      ? product.description.slice(0, 160)
      : `خرید ${product.name} برند ${product.brand} — کفش رانینگ اورجینال با ارسال سریع از ${SITE_NAME}. ${product.description}`.slice(
          0,
          160
        );

  const image = product.images[0]
    ? absoluteUrl(product.images[0])
    : absoluteUrl(OG_IMAGE_PATH);

  return {
    title,
    description,
    keywords: [
      `کفش رانینگ ${product.brand}`,
      product.name,
      "کفش دویدن اورجینال",
      `خرید ${product.name}`,
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "fa_IR",
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [{ url: image, width: 800, height: 800, alt: productImageAlt(product) }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
