import type { MetadataRoute } from "next";
import { readData } from "@/app/core/http-service/http-service";
import { CATEGORIES, BRANDS } from "@/lib/constants";
import { BLOG_POSTS } from "@/data/blog-posts";
import { brandToSlug, absoluteUrl, categoryPath, productPath } from "@/lib/seo/site";

type ProductListRaw = {
  products?: { slug: string }[];
  items?: { slug: string }[];
  has_more?: boolean;
  hasMore?: boolean;
};

async function fetchAllProductSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 50) {
    try {
      const data = await readData<ProductListRaw>(
        `/products?sort=newest&page=${page}&pageSize=100`
      );
      const batch = (data.products ?? data.items ?? []).map((p) => p.slug);
      slugs.push(...batch);
      hasMore = Boolean(data.has_more ?? data.hasMore ?? batch.length >= 100);
      page += 1;
      if (batch.length === 0) hasMore = false;
    } catch {
      break;
    }
  }

  return [...new Set(slugs)];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: absoluteUrl("/products"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.filter(
    (c) => c.value && c.value !== "all"
  ).map((c) => ({
    url: absoluteUrl(categoryPath(c.id)),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const brandRoutes: MetadataRoute.Sitemap = BRANDS.map((brand) => ({
    url: absoluteUrl(`/brand/${brandToSlug(brand)}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productSlugs = await fetchAllProductSlugs();
  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: absoluteUrl(productPath(slug)),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...categoryRoutes,
    ...brandRoutes,
    ...productRoutes,
  ];
}
