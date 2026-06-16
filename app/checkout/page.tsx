"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";
import { RequireAuth } from "@/components/profile/require-auth";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const isSyncing = useCartStore((s) => s.isSyncing);
  const hasItems = items.length > 0;

  let body: React.ReactNode;
  if (isSyncing && !hasItems) {
    body = (
      <p className="py-12 text-center text-sm text-muted-foreground">
        در حال بارگذاری سبد خرید...
      </p>
    );
  } else if (!hasItems) {
    body = (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">سبد خرید شما خالی است.</p>
        <Button className="mt-4" asChild>
          <Link href="/">بازگشت به فروشگاه</Link>
        </Button>
      </div>
    );
  } else {
    body = (
      <RequireAuth>
        <CheckoutFlow />
      </RequireAuth>
    );
  }

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
          <Link href="/" className="hover:text-foreground">
            فروشگاه
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">تکمیل خرید</span>
        </div>

        <h1 className="mb-6 flex items-center gap-2 text-xl font-bold">
          <ShoppingBag className="h-6 w-6 text-primary" />
          تکمیل خرید
        </h1>

        {body}
      </main>
      <BottomNav />
      <CartDrawer />
    </>
  );
}
