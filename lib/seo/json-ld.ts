import {
  INSTAGRAM_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  productPath,
} from "@/lib/seo/site";
import type { Product } from "@/lib/types";

export function homePageJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "fa-IR",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      sameAs: [INSTAGRAM_URL],
    },
    {
      "@context": "https://schema.org",
      "@type": "SportingGoodsStore",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      telephone: "+98-905-108-3434",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IR",
        addressLocality: "تهران",
      },
      openingHours: "Mo-Su 00:00-23:59",
      sameAs: [INSTAGRAM_URL],
    },
  ];
}

export function productJsonLd(product: Product) {
  const url = absoluteUrl(productPath(product.slug));
  const image = product.images[0]
    ? absoluteUrl(product.images[0])
    : undefined;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "IRR",
      price: String(product.price),
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
  };

  if (product.rating && product.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(product.rating),
      reviewCount: String(product.reviewCount),
    };
  }

  return schema;
}

export function breadcrumbJsonLd(
  items: { name: string; href: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}
