"use client";

import { Suspense, useState, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Highlights } from "@/components/home/highlights";
import { HeroBanner } from "@/components/home/hero-banner";
import { BrandScroll } from "@/components/home/brand-scroll";
import { CategoryTabs } from "@/components/home/category-tabs";
import { ProductGridSection } from "@/components/home/product-grid-section";
import { FilterOverlay } from "@/components/filters/filter-overlay";
import { FilterToolbar } from "@/components/filters/filter-toolbar";
import { ActiveFilterChips } from "@/components/filters/active-filter-chips";
import { useProductFilters } from "@/hooks/use-product-filters";
import type { Brand } from "@/lib/types";

function HomeContent() {
  const {
    filters,
    setFilters,
    setSearch,
    setCategory,
    clearFilters,
  } = useProductFilters();

  const [productTotal, setProductTotal] = useState(0);
  const [productsLoading, setProductsLoading] = useState(true);

  const handleTotalChange = useCallback((total: number, isLoading: boolean) => {
    setProductTotal(total);
    setProductsLoading(isLoading);
  }, []);

  const category = filters.category ?? "all";
  const search = filters.search ?? "";

  const handleHighlight = (filter: string) => {
    if (filter === "new") {
      setFilters({ ...filters, sort: "newest" });
    } else if (filter === "bestseller") {
      setFilters({ ...filters, sort: "bestseller" });
    } else if (filter === "discount") {
      setFilters({ ...filters, sort: "price_asc" });
    } else if (filter === "trail" || filter === "race") {
      setCategory(filter);
    }
  };

  const toggleBrand = (brand: Brand) => {
    const brands = filters.brands ?? [];
    const next = brands.includes(brand)
      ? brands.filter((b) => b !== brand)
      : [...brands, brand];
    setFilters({ ...filters, brands: next.length ? next : undefined });
  };

  return (
    <>
      <Header search={search} onSearchChange={setSearch} />
      <main className="page-container w-full min-w-0 pb-24 md:pb-8">
        <div className="flex w-full min-w-0 flex-col gap-4 py-4">
          {/* <Highlights onSelect={handleHighlight} /> */}
          <HeroBanner />
          <BrandScroll selected={filters.brands} onToggle={toggleBrand} />
          <CategoryTabs active={category} onChange={setCategory} />
        </div>

        <FilterToolbar
          filters={filters}
          total={productTotal}
          isLoading={productsLoading}
        />

        <div className="pt-3">
          <ActiveFilterChips
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
          />
        </div>

        <ProductGridSection
          filters={filters}
          onTotalChange={handleTotalChange}
        />
      </main>
      <BottomNav />
      <CartDrawer />
      <FilterOverlay
        filters={filters}
        onChange={setFilters}
        onClear={clearFilters}
        resultCount={productTotal}
      />
    </>
  );
}

export function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          در حال بارگذاری...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
