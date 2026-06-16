import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { CATEGORIES } from "@/lib/constants";
import { absoluteUrl, categoryPath } from "@/lib/seo/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.filter((c) => c.value && c.value !== "all").map((c) => ({
    slug: c.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.id === slug);
  if (!cat) return { title: "دسته‌بندی" };
  const title = `کفش ${cat.label} | خرید آنلاین`;
  return {
    title,
    description: `خرید کفش ${cat.label} اورجینال — بهترین برندهای رانینگ در دکتر شوز با ارسال سریع.`,
    alternates: { canonical: absoluteUrl(categoryPath(slug)) },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.id === slug && c.value && c.value !== "all");
  if (!cat) notFound();

  return (
    <Suspense fallback={<div className="p-8 text-center">در حال بارگذاری...</div>}>
      <CatalogPage
        title={`کفش ${cat.label}`}
        description={`مجموعه کفش‌های ${cat.label} اورجینال`}
        filters={{ category: cat.value }}
        breadcrumbs={[
          { name: "خانه", href: "/" },
          { name: "دسته‌بندی", href: "/products" },
          { name: cat.label, href: categoryPath(slug) },
        ]}
      />
    </Suspense>
  );
}
