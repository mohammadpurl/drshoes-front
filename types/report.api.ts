export type SalesSummaryReport = {
  totalOrders: number;
  totalRevenue: number;
  pendingPaymentCount: number;
  awaitingReceiptCount: number;
  pendingReviewCount: number;
  verifiedPaymentCount: number;
};

export type BrandSalesRow = {
  brand: string;
  orderCount: number;
  unitsSold: number;
  revenue: number;
};

export type ProductSalesRow = {
  productId: string;
  productName: string;
  brand: string;
  slug: string;
  unitsSold: number;
  revenue: number;
};

export type AdminReportsData = {
  summary: SalesSummaryReport;
  byBrand: BrandSalesRow[];
  byProduct: ProductSalesRow[];
};
