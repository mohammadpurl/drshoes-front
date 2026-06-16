import type {
  BrandSalesRow,
  ProductSalesRow,
  SalesSummaryReport,
} from "@/types/report.api";

function num(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function normalizeSalesSummary(data: unknown): SalesSummaryReport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    totalOrders: num(d.totalOrders),
    totalRevenue: num(d.totalRevenue),
    pendingPaymentCount: num(d.pendingPaymentCount ?? d.pendingPayments),
    awaitingReceiptCount: num(d.awaitingReceiptCount ?? d.awaitingReceipt),
    pendingReviewCount: num(
      d.pendingReviewCount ?? d.pendingReview ?? d.pendingPaymentsReview
    ),
    verifiedPaymentCount: num(
      d.verifiedPaymentCount ?? d.confirmedOrders ?? d.verifiedPayments
    ),
  };
}

export function normalizeBrandSalesRows(data: unknown): BrandSalesRow[] {
  const rows = Array.isArray(data)
    ? data
    : ((data as { items?: unknown[] })?.items ?? []);

  return rows.map((row) => {
    const r = (row ?? {}) as Record<string, unknown>;
    return {
      brand: String(r.brand ?? ""),
      orderCount: num(r.orderCount),
      unitsSold: num(r.unitsSold ?? r.quantity),
      revenue: num(r.revenue),
    };
  });
}

export function normalizeProductSalesRows(data: unknown): ProductSalesRow[] {
  const rows = Array.isArray(data)
    ? data
    : ((data as { items?: unknown[] })?.items ?? []);

  return rows.map((row) => {
    const r = (row ?? {}) as Record<string, unknown>;
    return {
      productId: String(r.productId ?? ""),
      productName: String(r.productName ?? ""),
      brand: String(r.brand ?? ""),
      slug: String(r.slug ?? ""),
      unitsSold: num(r.unitsSold ?? r.quantity),
      revenue: num(r.revenue),
    };
  });
}

export function formatCount(value: number | undefined | null): string {
  return num(value).toLocaleString("fa-IR");
}
