"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProductsPage } from "@/lib/products-api";
import type { ProductFilters } from "@/lib/types";

export function useInfiniteProducts(filters: ProductFilters) {
  return useInfiniteQuery({
    queryKey: ["products", filters],
    queryFn: ({ pageParam }) => fetchProductsPage(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + 1 : undefined,
  });
}
