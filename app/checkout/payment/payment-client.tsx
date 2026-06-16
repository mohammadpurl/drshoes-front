"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { clearCartAction } from "@/app/_actions/cart-actions";
import { getOrderAction } from "@/app/_actions/order-actions";
import { getPaymentSettingsAction } from "@/app/_actions/checkout-actions";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { PaymentPanel } from "@/components/checkout/payment-panel";
import { RequireAuth } from "@/components/profile/require-auth";
import { notifyError } from "@/lib/notify-action";
import { useCartStore } from "@/store/cart-store";
import type { OrderRead } from "@/types/order.api";
import type { PaymentSettingsRead } from "@/types/payment.api";

export default function CheckoutPaymentPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const clearCart = useCartStore((s) => s.clearCart);
  const setCartToken = useCartStore((s) => s.setCartToken);
  const cartCleared = useRef(false);

  const [order, setOrder] = useState<OrderRead | null>(null);
  const [settings, setSettings] = useState<PaymentSettingsRead | null>(null);
  const [loading, setLoading] = useState(true);

  const clearServerCart = useCallback(async () => {
    if (cartCleared.current) return;
    cartCleared.current = true;

    const cartToken = useCartStore.getState().cartToken;
    const clearResult = await clearCartAction(cartToken ?? undefined);
    if (clearResult.success && clearResult.data.cartToken) {
      setCartToken(clearResult.data.cartToken);
    }
    clearCart();
  }, [clearCart, setCartToken]);

  const load = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const [orderResult, settingsResult] = await Promise.all([
      getOrderAction(orderId),
      getPaymentSettingsAction(),
    ]);
    setLoading(false);

    if (!orderResult.success) {
      notifyError(orderResult.error);
      return;
    }
    if (!settingsResult.success) {
      notifyError(settingsResult.error);
      return;
    }
    setOrder(orderResult.data);
    setSettings(settingsResult.data);
    await clearServerCart();
  }, [orderId, clearServerCart]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <Header
        search=""
        onSearchChange={(q) => {
          if (q) router.push(`/?q=${encodeURIComponent(q)}`);
        }}
      />
      <main className="page-container mx-auto max-w-lg pb-28 pt-4 md:pb-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/checkout" className="hover:text-foreground">
            تکمیل خرید
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">پرداخت</span>
        </div>

        <RequireAuth>
          {loading ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              در حال بارگذاری...
            </p>
          ) : !orderId || !order || !settings ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              سفارش یافت نشد.
              <Link href="/profile/orders" className="mt-2 block text-primary">
                مشاهده سفارش‌ها
              </Link>
            </div>
          ) : (
            <PaymentPanel
              order={order}
              settings={settings}
              onUploaded={setOrder}
            />
          )}
        </RequireAuth>
      </main>
      <BottomNav />
      <CartDrawer />
    </>
  );
}
