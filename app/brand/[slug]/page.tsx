import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { BRANDS } from "@/lib/constants";
import type { Brand } from "@/lib/types";
import { absoluteUrl, brandPath, brandToSlug } from "@/lib/seo/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BRANDS.map((brand) => ({ slug: brandToSlug(brand) }));
}

function findBrand(slug: string): Brand | undefined {
  return BRANDS.find((b) => brandToSlug(b) === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = findBrand(slug);
  if (!brand) return { title: "برند" };
  const title = `کفش رانینگ ${brand} اورجینال`;
  return {
    title,
    description: `خرید کفش رانینگ ${brand} اورجینال — جدیدترین مدل‌ها با بهترین قیمت در دکتر شوز.`,
    alternates: { canonical: absoluteUrl(brandPath(brand)) },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = findBrand(slug);
  if (!brand) notFound();

  return (
    <Suspense fallback={<div className="p-8 text-center">در حال بارگذاری...</div>}>
      <CatalogPage
        title={`کفش ${brand}`}
        brand={brand}
        description={`کفش‌های رانینگ اورجینال برند ${brand}`}
        filters={{ brands: [brand] }}
        breadcrumbs={[
          { name: "خانه", href: "/" },
          { name: "برندها", href: "/products" },
          { name: brand, href: brandPath(brand) },
        ]}
      />
    </Suspense>
  );
}
