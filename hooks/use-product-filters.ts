"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProductFilters } from "@/lib/types";
import { DEFAULT_PRODUCT_SORT } from "@/lib/constants";
import {
  filtersToSearchParams,
  searchParamsToFilters,
} from "@/lib/url-filters";

export function useProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const parsed = searchParamsToFilters(searchParams);
    return {
      ...parsed,
      sort: parsed.sort ?? DEFAULT_PRODUCT_SORT,
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (next: ProductFilters) => {
      const params = filtersToSearchParams(next);
      const qs = params.toString();
      router.push(qs ? `/?${qs}` : "/", { scroll: false });
    },
    [router]
  );

  const setSearch = useCallback(
    (search: string) => {
      setFilters({ ...filters, search: search || undefined });
    },
    [filters, setFilters]
  );

  const setCategory = useCallback(
    (category: string) => {
      setFilters({
        ...filters,
        category: category === "all" ? undefined : category,
      });
    },
    [filters, setFilters]
  );

  const clearFilters = useCallback(() => {
    const search = filters.search;
    router.push(search ? `/?q=${encodeURIComponent(search)}` : "/", {
      scroll: false,
    });
  }, [filters.search, router]);

  return {
    filters,
    setFilters,
    setSearch,
    setCategory,
    clearFilters,
  };
}
