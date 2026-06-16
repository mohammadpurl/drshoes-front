"use client";

import { Suspense, useCallback, useState } from "react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProductGridSection } from "@/components/home/product-grid-section";
import { FilterToolbar } from "@/components/filters/filter-toolbar";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/seo/breadcrumbs";
import { BrandLogo } from "@/components/brand/brand-logo";
import { DEFAULT_PRODUCT_SORT } from "@/lib/constants";
import type { Brand, ProductFilters } from "@/lib/types";

interface CatalogPageProps {
  title: string;
  description?: string;
  filters: ProductFilters;
  breadcrumbs: BreadcrumbItem[];
  /** برای صفحه برند — نمایش لوگو کنار عنوان */
  brand?: Brand;
}

function CatalogContent({
  title,
  description,
  filters,
  breadcrumbs,
  brand,
}: CatalogPageProps) {
  const mergedFilters: ProductFilters = {
    sort: DEFAULT_PRODUCT_SORT,
    ...filters,
  };
  const [productTotal, setProductTotal] = useState(0);
  const [productsLoading, setProductsLoading] = useState(true);

  const handleTotalChange = useCallback((total: number, isLoading: boolean) => {
    setProductTotal(total);
    setProductsLoading(isLoading);
  }, []);

  return (
    <>
      <Header search="" onSearchChange={() => {}} />
      <main className="page-container w-full min-w-0 pb-24 md:pb-8">
        <Breadcrumbs items={breadcrumbs} />
        <header className="mb-4 space-y-1">
          <h1 className="flex items-center gap-3 text-2xl font-bold">
            {brand && <BrandLogo brand={brand} size={36} />}
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </header>
        <FilterToolbar
          filters={mergedFilters}
          total={productTotal}
          isLoading={productsLoading}
        />
        <ProductGridSection
          filters={mergedFilters}
          onTotalChange={handleTotalChange}
        />
      </main>
      <BottomNav />
      <CartDrawer />
    </>
  );
}

export function CatalogPage(props: CatalogPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          در حال بارگذاری...
        </div>
      }
    >
      <CatalogContent {...props} />
    </Suspense>
  );
}
