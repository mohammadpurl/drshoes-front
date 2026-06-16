"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart3, Package, ShoppingBag, Wallet } from "lucide-react";
import {
  getAdminBrandReportAction,
  getAdminProductReportAction,
  getAdminReportSummaryAction,
} from "@/app/_actions/admin-order-actions";
import {
  AdminCardRow,
  AdminDesktopTable,
  AdminMobileCard,
  AdminMobileCards,
} from "@/components/admin/admin-responsive-list";
import { formatToman } from "@/lib/format";
import { formatCount } from "@/lib/normalize-reports";
import { notifyError } from "@/lib/notify-action";
import type {
  BrandSalesRow,
  ProductSalesRow,
  SalesSummaryReport,
} from "@/types/report.api";

export function AdminReportsDashboard() {
  const [summary, setSummary] = useState<SalesSummaryReport | null>(null);
  const [byBrand, setByBrand] = useState<BrandSalesRow[]>([]);
  const [byProduct, setByProduct] = useState<ProductSalesRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [summaryResult, brandResult, productResult] = await Promise.all([
      getAdminReportSummaryAction(),
      getAdminBrandReportAction(),
      getAdminProductReportAction(),
    ]);
    setLoading(false);

    if (summaryResult.success) setSummary(summaryResult.data);
    else notifyError(summaryResult.error);

    if (brandResult.success) setByBrand(brandResult.data);
    else notifyError(brandResult.error);

    if (productResult.success) setByProduct(productResult.data);
    else notifyError(productResult.error);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">در حال بارگذاری گزارش‌ها...</p>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        گزارشی در دسترس نیست.
      </div>
    );
  }

  const cards = [
    {
      label: "کل سفارشات",
      value: formatCount(summary.totalOrders),
      icon: ShoppingBag,
    },
    {
      label: "درآمد کل",
      value: formatToman(summary.totalRevenue ?? 0),
      icon: Wallet,
    },
    {
      label: "در انتظار رسید",
      value: formatCount(summary.awaitingReceiptCount),
      icon: Package,
    },
    {
      label: "پرداخت تأیید شده",
      value: formatCount(summary.verifiedPaymentCount),
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">گزارش فروش</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-4 w-4" />
              <span className="text-sm">{label}</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-4 font-semibold">فروش بر اساس برند</h2>
        {byBrand.length === 0 ? (
          <p className="text-sm text-muted-foreground">داده‌ای موجود نیست.</p>
        ) : (
          <>
            <AdminMobileCards>
              {byBrand.map((row) => (
                <AdminMobileCard key={row.brand}>
                  <p className="mb-2 font-semibold">{row.brand}</p>
                  <AdminCardRow label="سفارش">
                    {formatCount(row.orderCount)}
                  </AdminCardRow>
                  <AdminCardRow label="تعداد">
                    {formatCount(row.unitsSold)}
                  </AdminCardRow>
                  <AdminCardRow label="درآمد">
                    <span className="font-semibold text-primary">
                      {formatToman(row.revenue ?? 0)}
                    </span>
                  </AdminCardRow>
                </AdminMobileCard>
              ))}
            </AdminMobileCards>

            <AdminDesktopTable className="rounded-none border-0 bg-transparent">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-start text-muted-foreground">
                    <th className="py-2 font-medium">برند</th>
                    <th className="py-2 font-medium">سفارش</th>
                    <th className="py-2 font-medium">تعداد</th>
                    <th className="py-2 font-medium">درآمد</th>
                  </tr>
                </thead>
                <tbody>
                  {byBrand.map((row) => (
                    <tr
                      key={row.brand}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-2 font-medium">{row.brand}</td>
                      <td className="py-2">{formatCount(row.orderCount)}</td>
                      <td className="py-2">{formatCount(row.unitsSold)}</td>
                      <td className="py-2">{formatToman(row.revenue ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AdminDesktopTable>
          </>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-4 font-semibold">پرفروش‌ترین محصولات</h2>
        {byProduct.length === 0 ? (
          <p className="text-sm text-muted-foreground">داده‌ای موجود نیست.</p>
        ) : (
          <>
            <AdminMobileCards>
              {byProduct.map((row) => (
                <AdminMobileCard key={row.productId}>
                  <p className="mb-1 font-semibold">{row.productName}</p>
                  <p className="mb-2 text-xs text-muted-foreground">
                    {row.brand}
                  </p>
                  <AdminCardRow label="تعداد فروش">
                    {formatCount(row.unitsSold)}
                  </AdminCardRow>
                  <AdminCardRow label="درآمد">
                    <span className="font-semibold text-primary">
                      {formatToman(row.revenue ?? 0)}
                    </span>
                  </AdminCardRow>
                </AdminMobileCard>
              ))}
            </AdminMobileCards>

            <AdminDesktopTable className="rounded-none border-0 bg-transparent">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-start text-muted-foreground">
                    <th className="py-2 font-medium">محصول</th>
                    <th className="py-2 font-medium">برند</th>
                    <th className="py-2 font-medium">تعداد فروش</th>
                    <th className="py-2 font-medium">درآمد</th>
                  </tr>
                </thead>
                <tbody>
                  {byProduct.map((row) => (
                    <tr
                      key={row.productId}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-2 font-medium">{row.productName}</td>
                      <td className="py-2">{row.brand}</td>
                      <td className="py-2">{formatCount(row.unitsSold)}</td>
                      <td className="py-2">{formatToman(row.revenue ?? 0)}</td>
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
