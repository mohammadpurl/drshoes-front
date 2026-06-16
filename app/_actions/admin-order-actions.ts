"use server";

import {
  patchDataWithAuth,
  readDataWithAuth,
} from "@/app/core/http-service/http-service";
import { extractActionErrorMessage } from "@/app/_actions/extract-action-error";
import type {
  AdminOrderListResponse,
  AdminOrderRead,
  OrderFulfillmentUpdate,
} from "@/types/order.api";
import type { PaymentInfo, PaymentInfoUpdate } from "@/types/payment.api";
import type { ActionResult, ActionVoidResult } from "@/types/action.types";
import type {
  BrandSalesRow,
  ProductSalesRow,
  SalesSummaryReport,
} from "@/types/report.api";
import {
  normalizeBrandSalesRows,
  normalizeProductSalesRows,
  normalizeSalesSummary,
} from "@/lib/normalize-reports";

type ListAdminOrdersParams = {
  page?: number;
  pageSize?: number;
  status?: string;
  paymentStatus?: string;
};

export async function getAdminPaymentSettingsAction(): Promise<
  ActionResult<PaymentInfo>
> {
  try {
    const data = await readDataWithAuth<PaymentInfo>("/admin/settings/payment");
    return { success: true, data };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت تنظیمات پرداخت"),
    };
  }
}

export async function updateAdminPaymentSettingsAction(
  body: PaymentInfoUpdate
): Promise<ActionResult<PaymentInfo>> {
  try {
    const data = await patchDataWithAuth<PaymentInfoUpdate, PaymentInfo>(
      "/admin/settings/payment",
      body
    );
    return { success: true, data };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در ذخیره تنظیمات پرداخت"),
    };
  }
}

export async function listAdminOrdersAction(
  params: ListAdminOrdersParams = {}
): Promise<ActionResult<AdminOrderListResponse>> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  try {
    const qs = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (params.status) qs.set("status", params.status);
    if (params.paymentStatus) qs.set("paymentStatus", params.paymentStatus);

    const data = await readDataWithAuth<AdminOrderListResponse>(
      `/admin/orders?${qs}`
    );
    return {
      success: true,
      data: { orders: data.orders ?? [], total: data.total ?? 0 },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت سفارش‌ها"),
    };
  }
}

export async function getAdminOrderAction(
  orderId: string
): Promise<ActionResult<AdminOrderRead>> {
  try {
    const data = await readDataWithAuth<AdminOrderRead>(
      `/admin/orders/${orderId}`
    );
    return { success: true, data };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت سفارش"),
    };
  }
}

export async function reviewAdminOrderPaymentAction(
  orderId: string,
  body: { paymentStatus: "verified" | "rejected"; note?: string }
): Promise<ActionResult<AdminOrderRead>> {
  const action = body.paymentStatus === "verified" ? "verify" : "reject";
  try {
    const data = await patchDataWithAuth<
      { action: string; note?: string },
      AdminOrderRead
    >(`/admin/orders/${orderId}/payment`, {
      action,
      note: body.note,
    });
    return { success: true, data };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در بررسی پرداخت"),
    };
  }
}

export async function updateAdminOrderStatusAction(
  orderId: string,
  status: string
): Promise<ActionVoidResult> {
  try {
    await patchDataWithAuth(
      `/admin/orders/${orderId}/status?status=${status}`,
      {}
    );
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در به‌روزرسانی وضعیت"),
    };
  }
}

export async function updateAdminOrderFulfillmentAction(
  orderId: string,
  body: OrderFulfillmentUpdate
): Promise<ActionResult<AdminOrderRead>> {
  try {
    const data = await patchDataWithAuth<
      OrderFulfillmentUpdate,
      AdminOrderRead
    >(`/admin/orders/${orderId}/fulfillment`, body);
    return { success: true, data };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در ذخیره اطلاعات ارسال"),
    };
  }
}

export async function getAdminReportSummaryAction(): Promise<
  ActionResult<SalesSummaryReport>
> {
  try {
    const data = await readDataWithAuth<unknown>("/admin/reports/summary");
    return { success: true, data: normalizeSalesSummary(data) };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت گزارش"),
    };
  }
}

export async function getAdminBrandReportAction(): Promise<
  ActionResult<BrandSalesRow[]>
> {
  try {
    const data = await readDataWithAuth<unknown>("/admin/reports/by-brand");
    return { success: true, data: normalizeBrandSalesRows(data) };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در گزارش برندها"),
    };
  }
}

export async function getAdminProductReportAction(): Promise<
  ActionResult<ProductSalesRow[]>
> {
  try {
    const data = await readDataWithAuth<unknown>("/admin/reports/by-product");
    return { success: true, data: normalizeProductSalesRows(data) };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در گزارش محصولات"),
    };
  }
}
