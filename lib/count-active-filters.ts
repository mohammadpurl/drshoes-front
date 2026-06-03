import type { ProductFilters } from "./types";

export function countActiveFilters(filters: ProductFilters): number {
  let count = 0;
  if (filters.brands?.length) count += filters.brands.length;
  if (filters.sizes?.length) count += filters.sizes.length;
  if (filters.footTypes?.length) count += filters.footTypes.length;
  if (filters.surfaces?.length) count += filters.surfaces.length;
  if (filters.gender) count += 1;
  if (filters.sort && filters.sort !== "newest") count += 1;
  if (filters.minPrice != null && filters.minPrice > 0) count += 1;
  if (filters.maxPrice != null && filters.maxPrice < 30_000_000) count += 1;
  return count;
}
