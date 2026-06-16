"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Package } from "lucide-react";
import { getOrderAction } from "@/app/_actions/order-actions";
import { ProfileShell } from "@/components/profile/profile-shell";
import { RequireAuth } from "@/components/profile/require-auth";
import { ProductImage } from "@/components/product/product-image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatToman } from "@/lib/format";
import {
  formatOrderDate,
  orderDisplayStatusClass,
  orderDisplayStatusLabel,
} from "@/lib/order-status";
import { notifyError } from "@/lib/notify-action";
import type { OrderRead } from "@/types/order.api";
import type { PaymentSettingsRead } from "@/types/payment.api";
import { OrderFulfillmentInfo } from "@/components/profile/order-fulfillment-info";
import { PaymentPanel } from "@/components/checkout/payment-panel";
import { getPaymentSettingsAction } from "@/app/_actions/checkout-actions";
import { useOrderRefresh } from "@/hooks/use-order-refresh";
import { isActiveOrderStatus } from "@/lib/order-fulfillment";

export default function ProfileOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  const [order, setOrder] = useState<OrderRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettingsRead | null>(
    null
  );

  const loadOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    const [orderResult, settingsResult] = await Promise.all([
      getOrderAction(orderId),
      getPaymentSettingsAction(),
    ]);
    setLoading(false);
    if (orderResult.success) {
      setOrder(orderResult.data);
    } else {
      notifyError(orderResult.error);
    }
    if (settingsResult.success) {
      setPaymentSettings(settingsResult.data);
    }
  }, [orderId]);

  const refreshOrder = useCallback(async () => {
    if (!orderId) return;
    const orderResult = await getOrderAction(orderId);
    if (orderResult.success) {
      setOrder(orderResult.data);
    }
  }, [orderId]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  useOrderRefresh({
    enabled: Boolean(order && isActiveOrderStatus(order.status)),
    onRefresh: () => {
      void refreshOrder();
    },
  });

  return (
    <ProfileShell title="جزئیات سفارش">
      <RequireAuth>
        <Link
          href="/profile/orders"
          className="mb-4 inline-block text-sm text-primary hover:underline"
        >
          ← بازگشت به سفارش‌ها
        </Link>

        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            در حال بارگذاری...
          </p>
        ) : !order ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            سفارش یافت نشد.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="flex items-center gap-2 text-lg font-bold">
                    <Package className="h-5 w-5 text-primary" />
                    سفارش
                  </h1>
                  <p className="mt-1 text-xs text-muted-foreground" dir="ltr">
                    #{order.id.slice(0, 8)}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatOrderDate(order.createdAt)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={orderDisplayStatusClass(order)}
                >
                  {orderDisplayStatusLabel(order)}
                </Badge>
              </div>
            </div>

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
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="line-clamp-2 text-sm font-medium hover:text-primary"
                      >
                        {item.productName}
                      </Link>
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
                {order.shippingProvince}، {order.shippingCity} —{" "}
                {order.shippingAddress}
              </p>
              <p className="text-xs text-muted-foreground" dir="ltr">
                کد پستی: {order.shippingPostalCode}
              </p>
            </section>

            <OrderFulfillmentInfo order={order} />

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-3 font-semibold">خلاصه پرداخت</h2>
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
                  <dd className="text-highlight">{formatToman(order.total)}</dd>
                </div>
              </dl>
              {order.notes ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  یادداشت: {order.notes}
                </p>
              ) : null}
              {order.paymentReviewNote &&
              order.paymentStatus === "rejected" ? (
                <p className="mt-3 text-xs text-red-600 dark:text-red-400">
                  دلیل رد: {order.paymentReviewNote}
                </p>
              ) : null}
              {order.paymentStatus === "verified" ? (
                <p className="mt-3 text-xs text-emerald-700 dark:text-emerald-400">
                  پرداخت تأیید شده است.
                </p>
              ) : null}
            </section>

            {paymentSettings &&
              (order.paymentStatus === "awaiting_receipt" ||
                order.paymentStatus === "rejected" ||
                order.paymentStatus === "pending_review" ||
                !order.paymentStatus) && (
                <PaymentPanel
                  order={order}
                  settings={paymentSettings}
                  onUploaded={setOrder}
                  redirectOnSuccess={false}
                />
              )}
          </div>
        )}
      </RequireAuth>
    </ProfileShell>
  );
}
