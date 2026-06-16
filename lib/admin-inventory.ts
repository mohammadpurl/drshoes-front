import type { Product } from "@/lib/types";

export type InventoryFilter = "all" | "in_stock" | "low" | "out";

export type InventoryStatus = "in_stock" | "low" | "out";

export function getAvailableSizes(product: Product): number[] {
  const unavailable = new Set(product.unavailableSizes ?? []);
  return (product.sizes ?? []).filter((size) => !unavailable.has(size));
}

export function getInventoryStatus(product: Product): InventoryStatus {
  const available = getAvailableSizes(product);
  if (available.length === 0) return "out";
  if (available.length <= 2) return "low";
  return "in_stock";
}

export function matchesInventoryFilter(
  product: Product,
  filter: InventoryFilter
): boolean {
  if (filter === "all") return true;
  return getInventoryStatus(product) === filter;
}

export function countInventoryStats(products: Product[]) {
  let inStock = 0;
  let low = 0;
  let out = 0;

  for (const product of products) {
    const status = getInventoryStatus(product);
    if (status === "out") out += 1;
    else if (status === "low") low += 1;
    else inStock += 1;
  }

  return { inStock, low, out, total: products.length };
}

export const INVENTORY_STATUS_LABELS: Record<InventoryStatus, string> = {
  in_stock: "موجود",
  low: "کم‌موجود",
  out: "ناموجود",
};

export const INVENTORY_STATUS_STYLES: Record<InventoryStatus, string> = {
  in_stock: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  low: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  out: "bg-red-500/10 text-red-700 dark:text-red-400",
};
