"use client";

import { formatOrderDate } from "@/lib/order-status";
import type { OrderRead } from "@/types/order.api";
import { hasFulfillmentInfo } from "@/lib/order-fulfillment";

type OrderFulfillmentInfoProps = {
  order: OrderRead;
};

export function OrderFulfillmentInfo({ order }: OrderFulfillmentInfoProps) {
  if (!hasFulfillmentInfo(order) && order.status === "confirmed") {
    return (
      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-2 font-semibold">وضعیت ارسال</h2>
        <p className="text-sm text-muted-foreground">
          پرداخت تأیید شده است. به‌زودی سفارش شما آماده و ارسال می‌شود.
        </p>
      </section>
    );
  }

  if (!hasFulfillmentInfo(order)) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <h2 className="mb-3 font-semibold">اطلاعات ارسال</h2>
      <dl className="space-y-2 text-sm">
        {order.shippingMethod ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">روش ارسال</dt>
            <dd className="font-medium">{order.shippingMethod}</dd>
          </div>
        ) : null}
        {order.trackingNumber ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">کد رهگیری</dt>
            <dd className="font-mono text-xs" dir="ltr">
              {order.trackingNumber}
            </dd>
          </div>
        ) : null}
        {order.shippedAt ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">تاریخ ارسال</dt>
            <dd>{formatOrderDate(order.shippedAt)}</dd>
          </div>
        ) : null}
        {order.shippingNote ? (
          <div>
            <dt className="text-muted-foreground">توضیحات</dt>
            <dd className="mt-1 leading-relaxed">{order.shippingNote}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
