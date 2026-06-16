"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { useInfiniteProducts } from "@/hooks/use-infinite-products";
import type { ProductFilters } from "@/lib/types";

interface ProductGridSectionProps {
  filters: ProductFilters;
  onTotalChange?: (total: number, isLoading: boolean) => void;
}

export function ProductGridSection({
  filters,
  onTotalChange,
}: ProductGridSectionProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteProducts(filters);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const products = data?.pages.flatMap((p) => p.products) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  useEffect(() => {
    onTotalChange?.(total, isLoading);
  }, [total, isLoading, onTotalChange]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-12 text-center text-sm text-destructive">
        {error instanceof Error
          ? error.message
          : "خطا در دریافت محصولات از سرور"}
      </p>
    );
  }

  return (
    <section id="products" className="w-full min-w-0 scroll-mt-24 pb-8 pt-4">
      {products.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          محصولی یافت نشد
        </p>
      ) : (
        <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        )}
      </div>
    </section>
  );
}
