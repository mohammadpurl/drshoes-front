import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "همه کفش‌های رانینگ",
  description:
    "مشاهده و خرید تمام کفش‌های رانینگ اورجینال — آدیداس، نایک، On Running، ASICS و برندهای برتر در دکتر شوز.",
  alternates: { canonical: absoluteUrl("/products") },
};

export default function ProductsIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          در حال بارگذاری...
        </div>
      }
    >
      <CatalogPage
        title="همه محصولات"
        description="کفش‌های رانینگ اورجینال با بهترین قیمت"
        filters={{}}
        breadcrumbs={[
          { name: "خانه", href: "/" },
          { name: "همه محصولات", href: "/products" },
        ]}
      />
    </Suspense>
  );
}
