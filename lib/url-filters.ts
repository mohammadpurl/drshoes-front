import type { Brand, FootType, Gender, ProductFilters, SortOption, Surface } from "./types";

export function filtersToSearchParams(filters: ProductFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.set("q", filters.search);
  if (filters.category && filters.category !== "all")
    params.set("category", filters.category);
  if (filters.brands?.length) params.set("brands", filters.brands.join(","));
  if (filters.sizes?.length) params.set("sizes", filters.sizes.join(","));
  if (filters.footTypes?.length)
    params.set("footType", filters.footTypes.join(","));
  if (filters.surfaces?.length)
    params.set("surface", filters.surfaces.join(","));
  if (filters.gender) params.set("gender", filters.gender);
  if (filters.minPrice != null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.sort) params.set("sort", filters.sort);
  return params;
}

export function searchParamsToFilters(
  params: URLSearchParams
): ProductFilters {
  const filters: ProductFilters = {};
  const q = params.get("q");
  if (q) filters.search = q;
  const category = params.get("category");
  if (category) filters.category = category;
  const brands = params.get("brands");
  if (brands) filters.brands = brands.split(",") as Brand[];
  const sizes = params.get("sizes");
  if (sizes) filters.sizes = sizes.split(",").map(Number);
  const footType = params.get("footType");
  if (footType) filters.footTypes = footType.split(",") as FootType[];
  const surface = params.get("surface");
  if (surface) filters.surfaces = surface.split(",") as Surface[];
  const gender = params.get("gender");
  if (gender) filters.gender = gender as Gender;
  const minPrice = params.get("minPrice");
  if (minPrice) filters.minPrice = Number(minPrice);
  const maxPrice = params.get("maxPrice");
  if (maxPrice) filters.maxPrice = Number(maxPrice);
  const sort = params.get("sort");
  if (sort) filters.sort = sort as SortOption;
  return filters;
}
