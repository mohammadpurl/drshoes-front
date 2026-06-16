"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { listOrdersAction } from "@/app/_actions/order-actions";
import { ProfileShell } from "@/components/profile/profile-shell";
import { RequireAuth } from "@/components/profile/require-auth";
import { ProductImage } from "@/components/product/product-image";
import { Badge } from "@/components/ui/badge";
import { formatToman } from "@/lib/format";
import {
  formatOrderDate,
  orderDisplayStatusClass,
  orderDisplayStatusLabel,
} from "@/lib/order-status";
import { notifyError } from "@/lib/notify-action";
import { useOrderRefresh } from "@/hooks/use-order-refresh";
import { isActiveOrderStatus } from "@/lib/order-fulfillment";
import type { OrderRead } from "@/types/order.api";

export default function ProfileOrdersPage() {
  const [orders, setOrders] = useState<OrderRead[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const result = await listOrdersAction();
    setLoading(false);
    if (result.success) {
      setOrders(result.data.orders);
      return;
    }
    notifyError(result.error);
  }, []);

  const refreshOrders = useCallback(async () => {
    const result = await listOrdersAction();
    if (result.success) {
      setOrders(result.data.orders);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  useOrderRefresh({
    enabled: orders.some((order) => isActiveOrderStatus(order.status)),
    onRefresh: () => {
      void refreshOrders();
    },
  });

  return (
    <ProfileShell title="سفارش‌های من">
      <RequireAuth>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            در حال بارگذاری سفارش‌ها...
          </p>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              هنوز سفارشی ثبت نکرده‌اید.
            </p>
            <Link
              href="/products"
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/profile/orders/${order.id}`}
                  className="block rounded-2xl border border-border bg-card p-4 transition hover:bg-muted/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {formatOrderDate(order.createdAt)}
                      </p>
                      <p className="mt-1 font-semibold">
                        {formatToman(order.total)}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {order.items.length} قلم کالا
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant="outline"
                        className={orderDisplayStatusClass(order)}
                      >
                        {orderDisplayStatusLabel(order)}
                      </Badge>
                      <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  {order.items.length > 0 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto">
                      {order.items.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted"
                        >
                          {item.imageUrl ? (
                            <ProductImage
                              src={item.imageUrl}
                              slug={item.productSlug}
                              productId={item.productId}
                              alt={item.productName}
                              fill
                              className="object-contain p-1"
                              sizes="56px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                              —
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </RequireAuth>
    </ProfileShell>
  );
}
