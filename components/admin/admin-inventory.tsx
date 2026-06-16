"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Search } from "lucide-react";
import {
  getAdminProductsAction,
  updateAdminProductAction,
} from "@/app/_actions/product-actions";
import { ProductImage } from "@/components/product/product-image";
import {
  AdminCardRow,
  AdminDesktopTable,
  AdminMobileCard,
  AdminMobileCards,
} from "@/components/admin/admin-responsive-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  countInventoryStats,
  getAvailableSizes,
  getInventoryStatus,
  INVENTORY_STATUS_LABELS,
  INVENTORY_STATUS_STYLES,
  matchesInventoryFilter,
  type InventoryFilter,
} from "@/lib/admin-inventory";
import { formatCount } from "@/lib/normalize-reports";
import { notifyError, notifySuccess } from "@/lib/notify-action";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS: { id: InventoryFilter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "in_stock", label: "موجود" },
  { id: "low", label: "کم‌موجود" },
  { id: "out", label: "ناموجود" },
];

export function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InventoryFilter>("all");
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getAdminProductsAction();
    setLoading(false);
    if (result.success) {
      setProducts(result.data);
      return;
    }
    notifyError(result.error);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => countInventoryStats(products), [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      if (!matchesInventoryFilter(product, filter)) return false;
      if (!q) return true;
      return (
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.slug.toLowerCase().includes(q)
      );
    });
  }, [filter, products, query]);

  const toggleSize = (product: Product, size: number) => {
    const unavailable = new Set(product.unavailableSizes ?? []);
    if (unavailable.has(size)) unavailable.delete(size);
    else unavailable.add(size);

    const nextUnavailable = Array.from(unavailable).sort((a, b) => a - b);

    startTransition(async () => {
      const result = await updateAdminProductAction(product.id, {
        unavailableSizes: nextUnavailable,
      });
      if (result.success) {
        setProducts((current) =>
          current.map((p) =>
            p.id === product.id
              ? { ...p, unavailableSizes: nextUnavailable }
              : p
          )
        );
        notifySuccess(`موجودی سایز ${size} به‌روز شد`);
        return;
      }
      notifyError(result.error);
    });
  };

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">در حال بارگذاری موجودی...</p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">موجودی انبار</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          وضعیت سایزها را ببینید و با یک کلیک موجود/ناموجود کنید.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "کل محصولات", value: stats.total, tone: "" },
          { label: "موجود", value: stats.inStock, tone: "text-emerald-600" },
          { label: "کم‌موجود", value: stats.low, tone: "text-amber-600" },
          { label: "ناموجود", value: stats.out, tone: "text-red-600" },
        ].map(({ label, value, tone }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={cn("mt-1 text-2xl font-bold", tone)}>
              {formatCount(value)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={filter === item.id ? "default" : "outline"}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام یا برند..."
            className="ps-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          محصولی با این فیلتر یافت نشد.
        </div>
      ) : (
        <>
          <AdminMobileCards>
            {filtered.map((product) => {
              const status = getInventoryStatus(product);
              const available = getAvailableSizes(product);
              const unavailable = new Set(product.unavailableSizes ?? []);

              return (
                <AdminMobileCard key={product.id}>
                  <div className="flex items-start gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {product.images[0] ? (
                        <ProductImage
                          src={product.images[0]}
                          slug={product.slug}
                          productId={product.id}
                          alt=""
                          fill
                          className="object-contain p-1"
                          sizes="56px"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-2 font-medium">{product.name}</p>
                        <Badge
                          variant="outline"
                          className={INVENTORY_STATUS_STYLES[status]}
                        >
                          {INVENTORY_STATUS_LABELS[status]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {product.brand}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-0">
                    <AdminCardRow label="موجود">
                      <span className="font-medium">
                        {available.length} / {product.sizes?.length ?? 0}
                      </span>
                    </AdminCardRow>
                  </div>

                  <div className="mt-3">
                    <p className="mb-2 text-xs text-muted-foreground">
                      سایزها (کلیک = تغییر)
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(product.sizes ?? []).map((size) => {
                        const isUnavailable = unavailable.has(size);
                        return (
                          <button
                            key={size}
                            type="button"
                            disabled={pending}
                            onClick={() => toggleSize(product, size)}
                            className={cn(
                              "min-w-9 rounded-lg border px-2 py-1 text-xs font-medium transition",
                              isUnavailable
                                ? "border-red-200 bg-red-50 text-red-600 line-through dark:border-red-900 dark:bg-red-950/30"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30"
                            )}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/products/${product.slug}/edit`}>
                        <Pencil className="h-4 w-4" />
                        ویرایش
                      </Link>
                    </Button>
                  </div>
                </AdminMobileCard>
              );
            })}
          </AdminMobileCards>

          <AdminDesktopTable>
            <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-start">
                <th className="px-4 py-3 font-medium">محصول</th>
                <th className="px-4 py-3 font-medium">برند</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
                <th className="px-4 py-3 font-medium">سایزها (کلیک = تغییر)</th>
                <th className="px-4 py-3 font-medium">موجود</th>
                <th className="px-4 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const status = getInventoryStatus(product);
                const available = getAvailableSizes(product);
                const unavailable = new Set(product.unavailableSizes ?? []);

                return (
                  <tr
                    key={product.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {product.images[0] ? (
                            <ProductImage
                              src={product.images[0]}
                              slug={product.slug}
                              productId={product.id}
                              alt=""
                              fill
                              className="object-contain p-1"
                              sizes="48px"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 font-medium">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground" dir="ltr">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {product.brand}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={INVENTORY_STATUS_STYLES[status]}
                      >
                        {INVENTORY_STATUS_LABELS[status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {(product.sizes ?? []).map((size) => {
                          const isUnavailable = unavailable.has(size);
                          return (
                            <button
                              key={size}
                              type="button"
                              disabled={pending}
                              onClick={() => toggleSize(product, size)}
                              className={cn(
                                "min-w-9 rounded-lg border px-2 py-1 text-xs font-medium transition",
                                isUnavailable
                                  ? "border-red-200 bg-red-50 text-red-600 line-through dark:border-red-900 dark:bg-red-950/30"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30"
                              )}
                              title={
                                isUnavailable
                                  ? "کلیک برای موجود کردن"
                                  : "کلیک برای ناموجود کردن"
                              }
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {available.length} / {product.sizes?.length ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/products/${product.slug}/edit`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">ویرایش</span>
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </AdminDesktopTable>
        </>
      )}
    </div>
  );
}
