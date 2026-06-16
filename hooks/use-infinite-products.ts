"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getProductsPageAction } from "@/app/_actions/product-actions";
import type { ProductFilters } from "@/lib/types";

export function useInfiniteProducts(filters: ProductFilters) {
  return useInfiniteQuery({
    queryKey: ["products", filters],
    queryFn: async ({ pageParam }) => {
      const result = await getProductsPageAction(filters, pageParam);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + 1 : undefined,
  });
}
