"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/product/product-image";
import { Pencil, Trash2 } from "lucide-react";
import {
  deleteAdminProductAction,
  getAdminProductsAction,
} from "@/app/_actions/product-actions";
import {
  AdminCardRow,
  AdminDesktopTable,
  AdminMobileCard,
  AdminMobileCards,
} from "@/components/admin/admin-responsive-list";
import { formatToman } from "@/lib/format";
import { notifyError, notifySuccess } from "@/lib/notify-action";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getAdminProductsAction();
    if (result.success) {
      setProducts(result.data);
    } else {
      notifyError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const askDelete = (product: Product) => {
    setDeleteTarget({ id: product.id, name: product.name });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteAdminProductAction(deleteTarget.id);
      if (result.success) {
        setProducts((prev) =>
          prev.filter((p) => p.id !== deleteTarget.id)
        );
        notifySuccess("محصول حذف شد");
      } else {
        notifyError(result.error);
      }

      setConfirmOpen(false);
      setDeleteTarget(null);
    });
  };

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">در حال بارگذاری محصولات...</p>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <p className="text-muted-foreground">هنوز محصولی ثبت نشده است.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/products/new">افزودن اولین کفش</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <AdminMobileCards>
        {products.map((p) => (
          <AdminMobileCard key={p.id}>
            <div className="flex items-start gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                {p.images[0] && (
                  <ProductImage
                    src={p.images[0]}
                    slug={p.slug}
                    productId={p.id}
                    alt=""
                    fill
                    className="object-contain p-1"
                    sizes="56px"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{p.name}</p>
                <div className="mt-2 space-y-0">
                  <AdminCardRow label="برند">
                    <span className="text-muted-foreground">{p.brand}</span>
                  </AdminCardRow>
                  <AdminCardRow label="قیمت">
                    <span className="font-semibold text-primary">
                      {formatToman(p.price)}
                    </span>
                  </AdminCardRow>
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-1">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/products/${p.slug}/edit`}>
                  <Pencil className="h-4 w-4" />
                  ویرایش
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={() => askDelete(p)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                حذف
              </Button>
            </div>
          </AdminMobileCard>
        ))}
      </AdminMobileCards>

      <AdminDesktopTable>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-start">
              <th className="px-4 py-3 font-medium">تصویر</th>
              <th className="px-4 py-3 font-medium">نام</th>
              <th className="px-4 py-3 font-medium">برند</th>
              <th className="px-4 py-3 font-medium">قیمت</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                    {p.images[0] && (
                      <ProductImage
                        src={p.images[0]}
                        slug={p.slug}
                        productId={p.id}
                        alt=""
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.brand}</td>
                <td className="px-4 py-3">{formatToman(p.price)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/products/${p.slug}/edit`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">ویرایش</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={pending}
                      onClick={() => askDelete(p)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">حذف</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminDesktopTable>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmOpen(false);
            setDeleteTarget(null);
          } else {
            setConfirmOpen(true);
          }
        }}
        title="حذف محصول"
        description={
          deleteTarget ? `«${deleteTarget.name}» حذف شود؟` : undefined
        }
        confirmLabel="حذف"
        confirmVariant="destructive"
        cancelLabel="انصراف"
        loading={pending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
