import { filterProducts, paginateProducts } from "@/lib/filter-products";
import { PAGE_SIZE } from "@/lib/constants";
import { filtersToSearchParams } from "@/lib/url-filters";
import type { Product, ProductFilters } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

type ApiProductList = {
  products: Product[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
};

async function fetchFromApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchProductsPage(
  filters: ProductFilters,
  page: number
): Promise<{ products: Product[]; hasMore: boolean; total: number }> {
  if (API_BASE) {
    const params = filtersToSearchParams(filters);
    params.set("page", String(page));
    params.set("pageSize", String(PAGE_SIZE));
    const data = await fetchFromApi<ApiProductList>(
      `/products?${params.toString()}`
    );
    return {
      products: data.products,
      hasMore: data.has_more,
      total: data.total,
    };
  }

  await new Promise((r) => setTimeout(r, 300));
  const all = filterProducts(filters);
  const products = paginateProducts(all, page, PAGE_SIZE);
  const loadedCount = (page - 1) * PAGE_SIZE + products.length;
  return {
    products,
    hasMore: loadedCount < all.length,
    total: all.length,
  };
}

export async function fetchProduct(slug: string): Promise<Product> {
  if (API_BASE) {
    return fetchFromApi<Product>(`/products/${slug}`);
  }

  const { getProductBySlug } = await import("@/data/products");
  await new Promise((r) => setTimeout(r, 100));
  const product = getProductBySlug(slug);
  if (!product) throw new Error("محصول یافت نشد");
  return product;
}
