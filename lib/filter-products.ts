import { products } from "@/data/products";
import type { Product, ProductFilters } from "@/lib/types";

export function filterProducts(filters: ProductFilters): Product[] {
  let result = [...products];

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }

  if (filters.category && filters.category !== "all") {
    if (filters.category === "women") {
      result = result.filter(
        (p) => p.gender === "women" || p.gender === "unisex"
      );
    } else if (filters.category === "men") {
      result = result.filter(
        (p) => p.gender === "men" || p.gender === "unisex"
      );
    } else {
      result = result.filter((p) => p.category === filters.category);
    }
  }

  if (filters.brands?.length) {
    result = result.filter((p) => filters.brands!.includes(p.brand));
  }

  if (filters.sizes?.length) {
    result = result.filter((p) =>
      filters.sizes!.some((s) => p.sizes.includes(s))
    );
  }

  if (filters.footTypes?.length) {
    result = result.filter((p) =>
      filters.footTypes!.some((ft) => p.footType.includes(ft))
    );
  }

  if (filters.surfaces?.length) {
    result = result.filter((p) =>
      filters.surfaces!.some((s) => p.surface.includes(s))
    );
  }

  if (filters.gender) {
    result = result.filter(
      (p) => p.gender === filters.gender || p.gender === "unisex"
    );
  }

  if (filters.minPrice != null) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice != null) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  const sort = filters.sort ?? "newest";
  result.sort((a, b) => {
    switch (sort) {
      case "bestseller":
        return Number(b.isBestseller) - Number(a.isBestseller);
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "newest":
      default:
        return Number(b.isNew) - Number(a.isNew);
    }
  });

  return result;
}

export function paginateProducts(
  items: Product[],
  page: number,
  pageSize: number
): Product[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
