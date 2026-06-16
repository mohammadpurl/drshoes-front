"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import {
  getAdminOrderAction,
  reviewAdminOrderPaymentAction,
} from "@/app/_actions/admin-order-actions";
import { AdminOrderFulfillmentForm } from "@/components/admin/admin-order-fulfillment-form";
import { ProductImage } from "@/components/product/product-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Separator } from "@/components/ui/separator";
import { formatToman } from "@/lib/format";
import {
  formatOrderDate,
  needsPaymentReview,
  orderDisplayStatusClass,
  orderDisplayStatusLabel,
} from "@/lib/order-status";
import { notifyError, notifySuccess } from "@/lib/notify-action";
import type { AdminOrderRead } from "@/types/order.api";

export function AdminOrderDetail({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrderRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [paymentReviewAction, setPaymentReviewAction] = useState<
    "verified" | "rejected" | null
  >(null);
  const [paymentReviewNote, setPaymentReviewNote] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getAdminOrderAction(orderId);
    setLoading(false);
    if (result.success) {
      setOrder(result.data);
      return;
    }
    notifyError(result.error);
  }, [orderId]);

  useEffect(() => {
    void load();
  }, [load]);

  const executePaymentReview = () => {
    if (!order || !paymentReviewAction) return;
    const action = paymentReviewAction;
    const label = action === "verified" ? "تأیید" : "رد";

    startTransition(async () => {
      const result = await reviewAdminOrderPaymentAction(order.id, {
        paymentStatus: action,
        note: paymentReviewNote.trim() || undefined,
      });
      setPaymentReviewAction(null);
      setPaymentReviewNote("");
      if (result.success) {
        notifySuccess(`پرداخت ${label} شد`);
        setOrder(result.data);
      } else {
        notifyError(result.error);
      }
    });
  };

  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        در حال بارگذاری...
      </p>
    );
  }

  if (!order) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        سفارش یافت نشد.
        <Button
          variant="ghost"
          className="mt-2"
          onClick={() => router.push("/admin/orders")}
        >
          بازگشت به لیست
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link
        href="/admin/orders"
        className="inline-block text-sm text-primary hover:underline"
      >
        ← بازگشت به سفارشات
      </Link>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-lg font-bold">
              <Package className="h-5 w-5 text-primary" />
              سفارش
            </h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground" dir="ltr">
              #{order.id}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {formatOrderDate(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={orderDisplayStatusClass(order)}
            >
              {orderDisplayStatusLabel(order)}
            </Badge>
          </div>
        </div>
      </div>

      <AdminOrderFulfillmentForm order={order} onUpdated={setOrder} />

      {needsPaymentReview(order) && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
          <h2 className="mb-3 font-semibold">بررسی پرداخت</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            رسید واریز ارسال شده و منتظر تأیید است.
          </p>
          <div className="mb-3 space-y-2">
            <label
              htmlFor="payment-review-note"
              className="text-sm font-medium"
            >
              یادداشت (اختیاری)
            </label>
            <textarea
              id="payment-review-note"
              value={paymentReviewNote}
              onChange={(e) => setPaymentReviewNote(e.target.value)}
              placeholder={
                paymentReviewAction === "rejected"
                  ? "دلیل رد پرداخت برای مشتری..."
                  : "یادداشت داخلی یا توضیح برای مشتری..."
              }
              className="min-h-20 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              maxLength={500}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              disabled={pending}
              onClick={() => setPaymentReviewAction("verified")}
            >
              تأیید پرداخت
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600"
              disabled={pending}
              onClick={() => setPaymentReviewAction("rejected")}
            >
              رد پرداخت
            </Button>
          </div>
        </section>
      )}

      <ConfirmDialog
        open={paymentReviewAction !== null}
        onOpenChange={(open) => {
          if (!open && !pending) setPaymentReviewAction(null);
        }}
        title={
          paymentReviewAction === "rejected" ? "رد پرداخت" : "تأیید پرداخت"
        }
        description={
          paymentReviewAction === "rejected"
            ? "آیا پرداخت این سفارش رد شود؟ مشتری باید رسید جدید ارسال کند."
            : "آیا پرداخت این سفارش تأیید شود؟"
        }
        confirmLabel={
          paymentReviewAction === "rejected" ? "رد پرداخت" : "تأیید پرداخت"
        }
        confirmVariant={
          paymentReviewAction === "rejected" ? "destructive" : "default"
        }
        loading={pending}
        onConfirm={executePaymentReview}
      />

      {order.receiptUrl && (
        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="mb-3 font-semibold">رسید پرداخت</h2>
          <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={order.receiptUrl}
              alt="رسید پرداخت"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-3 font-semibold">اقلام سفارش</h2>
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                {item.imageUrl ? (
                  <ProductImage
                    src={item.imageUrl}
                    slug={item.productSlug}
                    productId={item.productId}
                    alt={item.productName}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.brand} — سایز {item.size}
                </p>
                <p className="mt-1 text-sm">
                  {item.quantity} × {formatToman(item.unitPrice)}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold">
                {formatToman(item.lineTotal)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-3 font-semibold">آدرس ارسال</h2>
        <p className="text-sm">{order.shippingFullName}</p>
        <p className="text-sm text-muted-foreground" dir="ltr">
          {order.shippingPhone}
        </p>
        <p className="mt-2 text-sm leading-relaxed">
          {order.shippingProvince}، {order.shippingCity} — {order.shippingAddress}
        </p>
        <p className="text-xs text-muted-foreground" dir="ltr">
          کد پستی: {order.shippingPostalCode}
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-3 font-semibold">خلاصه مالی</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">جمع کالاها</dt>
            <dd>{formatToman(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">هزینه ارسال</dt>
            <dd>
              {order.shippingCost === 0
                ? "رایگان"
                : formatToman(order.shippingCost)}
            </dd>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <dt>مبلغ کل</dt>
            <dd className="text-primary">{formatToman(order.total)}</dd>
          </div>
        </dl>
        {order.notes && (
          <p className="mt-3 text-xs text-muted-foreground">
            یادداشت: {order.notes}
          </p>
        )}
      </section>
    </div>
  );
}
