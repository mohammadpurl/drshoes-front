"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Package, Settings } from "lucide-react";
import { useSessionStore } from "@/app/_store/auth-store";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProfileShell } from "@/components/profile/profile-shell";
import { Button } from "@/components/ui/button";

const quickLinks = [
  {
    href: "/profile/orders",
    label: "سفارش‌های من",
    description: "پیگیری وضعیت خریدها",
    icon: Package,
  },
  {
    href: "/profile/addresses",
    label: "آدرس‌ها",
    description: "مدیریت آدرس ارسال",
    icon: MapPin,
  },
  {
    href: "/profile/settings",
    label: "ویرایش پروفایل",
    description: "اطلاعات شخصی و تصویر",
    icon: Settings,
  },
] as const;

export default function ProfilePage() {
  const router = useRouter();
  const status = useSessionStore((s) => s.status);
  const session = useSessionStore((s) => s.session);

  const isAuthenticated = status === "authenticated" && session;
  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <>
        <Header search="" onSearchChange={() => {}} />
        <main className="page-container py-16 text-center text-sm text-muted-foreground">
          در حال بارگذاری...
        </main>
        <BottomNav />
        <CartDrawer />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header
          search=""
          onSearchChange={(q) => {
            if (q) router.push(`/?q=${encodeURIComponent(q)}`);
          }}
        />
        <main className="page-container mx-auto max-w-lg py-8 pb-24">
          <Button variant="ghost" size="sm" className="mb-4 -ms-2" asChild>
            <Link href="/">← بازگشت به فروشگاه</Link>
          </Button>
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <h1 className="text-xl font-bold">حساب کاربری</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              برای پیگیری سفارش و ذخیره آدرس، وارد حساب کاربری شوید
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button className="flex-1" asChild>
                <Link href="/login?redirect=/profile">ورود</Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/register?redirect=/profile">ثبت‌نام</Link>
              </Button>
            </div>
          </div>
        </main>
        <BottomNav />
        <CartDrawer />
      </>
    );
  }

  return (
    <ProfileShell title="پنل کاربری">
      <p className="mb-6 text-sm text-muted-foreground">
        از اینجا می‌توانید سفارش‌ها، آدرس‌ها و تنظیمات حساب خود را مدیریت کنید.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {quickLinks.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:bg-muted/30"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </ProfileShell>
  );
}
