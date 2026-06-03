"use client";

import { User, Package, MapPin, Settings } from "lucide-react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useRouter } from "next/navigation";

const menuItems = [
  { icon: Package, label: "سفارش‌های من" },
  { icon: MapPin, label: "آدرس‌ها" },
  { icon: Settings, label: "تنظیمات" },
];

export default function ProfilePage() {
  const router = useRouter();

  return (
    <>
      <Header
        search=""
        onSearchChange={(q) => {
          if (q) router.push(`/?q=${encodeURIComponent(q)}`);
        }}
      />
      <main className="page-container mx-auto max-w-lg py-8 pb-24">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-xl font-bold">کاربر مهمان</h1>
          <p className="text-center text-sm text-muted-foreground">
            برای پیگیری سفارش و ذخیره آدرس، وارد حساب کاربری شوید
          </p>
          <button
            type="button"
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white"
          >
            ورود / ثبت‌نام
          </button>
        </div>

        <ul className="mt-6 space-y-2">
          {menuItems.map(({ icon: Icon, label }) => (
            <li key={label}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-start hover:bg-muted/50"
              >
                <Icon className="h-5 w-5 text-primary" />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </main>
      <BottomNav />
      <CartDrawer />
    </>
  );
}
