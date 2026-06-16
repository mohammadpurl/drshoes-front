"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPageClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <>
      <Header search="" onSearchChange={() => {}} />
      <main className="page-container mx-auto max-w-lg pb-28 pt-12 md:pb-8">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
          <h1 className="mt-4 text-xl font-bold">سفارش ثبت شد</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            رسید پرداخت شما دریافت شد. پس از تأیید توسط تیم فروش، سفارش پردازش
            می‌شود.
          </p>
          {orderId && (
            <p className="mt-3 text-xs text-muted-foreground" dir="ltr">
              #{orderId.slice(0, 8)}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2">
            {orderId && (
              <Button asChild>
                <Link href={`/profile/orders/${orderId}`}>پیگیری سفارش</Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/">بازگشت به فروشگاه</Link>
            </Button>
          </div>
        </div>
      </main>
      <BottomNav />
      <CartDrawer />
    </>
  );
}
