"use server";

import { readData } from "@/app/core/http-service/http-service";
import {
  createDataWithAuth,
  deleteDataWithAuth,
  patchDataWithAuth,
  readDataWithAuth,
} from "@/app/core/http-service/http-service";
import { extractActionErrorMessage } from "@/app/_actions/extract-action-error";
import { DEFAULT_PRODUCT_SORT, PAGE_SIZE } from "@/lib/constants";
import { normalizeProduct, normalizeProducts } from "@/lib/normalize-product";
import { filtersToSearchParams } from "@/lib/url-filters";
import type { Product, ProductFilters, Review } from "@/lib/types";
import type {
  ProductCreateBody,
  ProductListResponse,
  ProductPatchBody,
  ProductReviewsResponse,
} from "@/types/product.api";
import type { ActionResult } from "@/types/action.types";

export type ProductsPageData = {
  products: Product[];
  hasMore: boolean;
  total: number;
};

function normalizeProductList(data: ProductListResponse): ProductsPageData {
  return {
    products: normalizeProducts(data.products ?? []),
    total: data.total ?? 0,
    hasMore: Boolean(data.has_more),
  };
}

function buildProductsQuery(filters: ProductFilters, page: number): string {
  const params = filtersToSearchParams({
    ...filters,
    sort: filters.sort ?? DEFAULT_PRODUCT_SORT,
  });
  params.set("page", String(page));
  params.set("pageSize", String(PAGE_SIZE));
  return params.toString();
}

/** فروشگاه — بازیابی محصولات بر اساس شناسه (برای علاقه‌مندی‌ها) */
export async function getProductsByIdsAction(
  ids: string[]
): Promise<ActionResult<Product[]>> {
  if (!ids.length) return { success: true, data: [] };

  try {
    const idSet = new Set(ids);
    const found: Product[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && found.length < ids.length && page <= 20) {
      const data = await readData<ProductListResponse>(
        `/products?page=${page}&pageSize=100`
      );
      for (const product of data.products ?? []) {
        if (idSet.has(product.id)) found.push(normalizeProduct(product));
      }
      hasMore = Boolean(data.has_more);
      page += 1;
    }

    const byId = new Map(found.map((p) => [p.id, p]));
    return {
      success: true,
      data: ids
        .map((id) => byId.get(id))
        .filter((p): p is Product => Boolean(p)),
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت محصولات"),
    };
  }
}

/** فروشگاه — لیست صفحه‌بندی‌شده `GET /products` */
export async function getProductsPageAction(
  filters: ProductFilters,
  page: number
): Promise<ActionResult<ProductsPageData>> {
  try {
    const data = await readData<ProductListResponse>(
      `/products?${buildProductsQuery(filters, page)}`
    );
    return { success: true, data: normalizeProductList(data) };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت محصولات"),
    };
  }
}

/** فروشگاه — جزئیات `GET /products/{slug}` */
export async function getProductBySlugAction(
  slug: string
): Promise<ActionResult<Product>> {
  try {
    const data = await readData<Product>(`/products/${slug}`);
    return { success: true, data: normalizeProduct(data) };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "محصول یافت نشد"),
    };
  }
}

/** فروشگاه — مرتبط `GET /products/{slug}/related` */
export async function getRelatedProductsAction(
  slug: string,
  limit = 4
): Promise<ActionResult<Product[]>> {
  try {
    const data = await readData<Product[] | { products?: Product[] }>(
      `/products/${slug}/related`
    );
    const list = Array.isArray(data) ? data : (data.products ?? []);
    return {
      success: true,
      data: normalizeProducts(list).slice(0, limit),
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت محصولات مرتبط"),
    };
  }
}

/** فروشگاه — نظرات `GET /products/{slug}/reviews` */
export async function getProductReviewsAction(
  slug: string
): Promise<ActionResult<Review[]>> {
  try {
    const data = await readData<ProductReviewsResponse | Review[]>(
      `/products/${slug}/reviews`
    );
    const list = Array.isArray(data)
      ? data
      : (data.reviews ?? data.items ?? []);
    return { success: true, data: list };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت نظرات"),
    };
  }
}

export type ProductReviewCreateBody = {
  rating: number;
  comment: string;
};

/** `POST /products/{slug}/reviews` */
export async function createProductReviewAction(
  slug: string,
  body: ProductReviewCreateBody
): Promise<ActionResult<Review>> {
  try {
    const data = await createDataWithAuth<ProductReviewCreateBody, Review>(
      `/products/${slug}/reviews`,
      body
    );
    return { success: true, data };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در ثبت نظر"),
    };
  }
}

/** ادمین — لیست `GET /products` */
export async function getAdminProductsAction(): Promise<ActionResult<Product[]>> {
  try {
    const data = await readDataWithAuth<ProductListResponse>(
      "/products?page=1&pageSize=200"
    );
    return { success: true, data: normalizeProductList(data).products };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت محصولات"),
    };
  }
}

/** ادمین — جزئیات قبل از ویرایش `GET /products/{slug}` */
export async function getAdminProductBySlugAction(
  slug: string
): Promise<ActionResult<Product>> {
  try {
    const data = await readDataWithAuth<Product>(`/products/${slug}`);
    return { success: true, data: normalizeProduct(data) };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "محصول یافت نشد"),
    };
  }
}

/** ادمین — ساخت `POST /admin/products` */
export async function createAdminProductAction(
  payload: ProductCreateBody
): Promise<ActionResult<Product>> {
  try {
    const data = await createDataWithAuth<ProductCreateBody, Product>(
      "/admin/products",
      payload
    );
    return { success: true, data: normalizeProduct(data) };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در ثبت محصول"),
    };
  }
}

/** ادمین — ویرایش `PATCH /admin/products/{productId}` */
export async function updateAdminProductAction(
  productId: string,
  payload: ProductPatchBody
): Promise<ActionResult<Product>> {
  try {
    const data = await patchDataWithAuth<ProductPatchBody, Product>(
      `/admin/products/${productId}`,
      payload
    );
    return { success: true, data: normalizeProduct(data) };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در ویرایش محصول"),
    };
  }
}

/** ادمین — حذف `DELETE /admin/products/{productId}` */
export async function deleteAdminProductAction(
  productId: string
): Promise<ActionResult> {
  try {
    await deleteDataWithAuth(`/admin/products/${productId}`);
    return { success: true, data: undefined };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در حذف محصول"),
    };
  }
}
