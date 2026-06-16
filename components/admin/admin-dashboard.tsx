"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CreditCard,
  Eye,
  Package,
  ShoppingBag,
} from "lucide-react";
import {
  getAdminReportSummaryAction,
  listAdminOrdersAction,
} from "@/app/_actions/admin-order-actions";
import { getAdminProductsAction } from "@/app/_actions/product-actions";
import { AdminOrderMobileCard } from "@/components/admin/admin-order-card";
import {
  AdminDesktopTable,
  AdminMobileCards,
} from "@/components/admin/admin-responsive-list";
import { countInventoryStats } from "@/lib/admin-inventory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatToman } from "@/lib/format";
import { formatCount } from "@/lib/normalize-reports";
import {
  formatOrderDate,
  orderDisplayStatusClass,
  orderDisplayStatusLabel,
} from "@/lib/order-status";
import { notifyError } from "@/lib/notify-action";
import type { AdminOrderRead } from "@/types/order.api";
import type { SalesSummaryReport } from "@/types/report.api";

export function AdminDashboard() {
  const [summary, setSummary] = useState<SalesSummaryReport | null>(null);
  const [pendingOrders, setPendingOrders] = useState<AdminOrderRead[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [inventoryStats, setInventoryStats] = useState({
    low: 0,
    out: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [summaryResult, ordersResult, productsResult] = await Promise.all([
      getAdminReportSummaryAction(),
      listAdminOrdersAction({
        paymentStatus: "pending_review",
        page: 1,
        pageSize: 8,
      }),
      getAdminProductsAction(),
    ]);
    setLoading(false);

    if (summaryResult.success) setSummary(summaryResult.data);
    else notifyError(summaryResult.error);

    if (ordersResult.success) {
      setPendingOrders(ordersResult.data.orders);
      setPendingTotal(ordersResult.data.total);
    } else {
      notifyError(ordersResult.error);
    }

    if (productsResult.success) {
      const stats = countInventoryStats(productsResult.data);
      setInventoryStats({
        low: stats.low,
        out: stats.out,
        total: stats.total,
      });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">در حال بارگذاری داشبورد...</p>
    );
  }

  const pendingReviewCount =
    pendingTotal > 0
      ? pendingTotal
      : (summary?.pendingReviewCount ?? 0);

  const lowStockCount = inventoryStats.low + inventoryStats.out;

  const cards = [
    {
      label: "در انتظار تأیید پرداخت",
      value: formatCount(pendingReviewCount),
      icon: AlertCircle,
      href: "/admin/payments",
      highlight: pendingReviewCount > 0,
    },
    {
      label: "کم‌موجود / ناموجود",
      value: formatCount(lowStockCount),
      icon: Package,
      href: "/admin/inventory",
      highlight: lowStockCount > 0,
    },
    {
      label: "در انتظار رسید",
      value: formatCount(summary?.awaitingReceiptCount ?? 0),
      icon: CreditCard,
      href: "/admin/orders?payment=awaiting_receipt",
      highlight: false,
    },
    {
      label: "کل سفارشات",
      value: formatCount(summary?.totalOrders ?? 0),
      icon: ShoppingBag,
      href: "/admin/orders",
      highlight: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">داشبورد</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          سفارشات، پرداخت‌ها و هشدارهای موجودی
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, href, highlight }) => (
          <Link
            key={label}
            href={href}
            className={`rounded-2xl border bg-card p-4 transition hover:border-primary/40 ${
              highlight
                ? "border-amber-300 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20"
                : "border-border"
            }`}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon
                className={`h-4 w-4 ${highlight ? "text-amber-600 dark:text-amber-400" : ""}`}
              />
              <span className="text-sm">{label}</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold">پرداخت‌های در انتظار تأیید</h2>
          {pendingReviewCount > 0 && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/payments">مشاهده همه ({formatCount(pendingReviewCount)})</Link>
            </Button>
          )}
        </div>

        {pendingOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            سفارشی برای تأیید پرداخت وجود ندارد.
          </p>
        ) : (
          <>
            <AdminMobileCards>
              {pendingOrders.map((order) => (
                <AdminOrderMobileCard
                  key={order.id}
                  order={order}
                  actionLabel="بررسی"
                />
              ))}
            </AdminMobileCards>

            <AdminDesktopTable className="rounded-none border-0 bg-transparent">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-start text-muted-foreground">
                    <th className="py-2 font-medium">شناسه</th>
                    <th className="py-2 font-medium">تاریخ</th>
                    <th className="py-2 font-medium">مشتری</th>
                    <th className="py-2 font-medium">مبلغ</th>
                    <th className="py-2 font-medium">وضعیت</th>
                    <th className="py-2 font-medium">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-2 font-mono text-xs" dir="ltr">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="py-2 text-xs text-muted-foreground">
                        {formatOrderDate(order.createdAt)}
                      </td>
                      <td className="py-2">{order.shippingFullName}</td>
                      <td className="py-2 font-medium">
                        {formatToman(order.total)}
                      </td>
                      <td className="py-2">
                        <Badge
                          variant="outline"
                          className={orderDisplayStatusClass(order)}
                        >
                          {orderDisplayStatusLabel(order)}
                        </Badge>
                      </td>
                      <td className="py-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                            بررسی
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AdminDesktopTable>
          </>
        )}
      </section>
    </div>
  );
}
