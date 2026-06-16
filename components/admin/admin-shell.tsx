"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  Store,
} from "lucide-react";
import { adminSignOutAction } from "@/app/_actions/admin-auth-actions";
import { useSessionStore } from "@/app/_store/auth-store";
import { notifyError, notifySuccess } from "@/lib/notify-action";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { href: "/admin/reports", label: "گزارش‌ها", icon: BarChart3, exact: true },
  { href: "/admin/orders", label: "سفارشات", icon: ShoppingBag },
  { href: "/admin/payments", label: "پرداخت‌ها", icon: CreditCard, exact: true },
  { href: "/admin/inventory", label: "موجودی", icon: Package, exact: true },
  { href: "/admin/products", label: "محصولات", icon: LayoutGrid },
  { href: "/admin/products/new", label: "افزودن کفش", icon: Plus, exact: true },
  { href: "/admin/settings", label: "تنظیمات", icon: Settings, exact: true },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSessionStore((s) => s.session);
  const clearSession = useSessionStore((s) => s.clearSession);
  const [pending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      const result = await adminSignOutAction();
      clearSession();
      if (result.success) {
        notifySuccess("از حساب خارج شدید");
        router.replace("/admin/login");
      } else {
        notifyError("خطا در خروج");
      }
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Store className="h-5 w-5 shrink-0 text-primary" />
            <span className="truncate text-sm font-bold sm:text-base">
              پنل مدیریت Dr.Shoes
            </span>
          </div>
          <div className="flex items-center gap-2">
            {session?.userName && (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {session.userName}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={pending}
            >
              <LogOut className="h-4 w-4" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:grid-cols-[200px_1fr]">
        <aside className="flex flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:pb-0">
          {nav.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);
            return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-primary text-white"
                  : "bg-card text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
            );
          })}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground lg:mt-4"
          >
            بازگشت به فروشگاه
          </Link>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
