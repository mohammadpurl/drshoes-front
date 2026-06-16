"use server";

import {
  createDataWithAuth,
  readData,
  readDataWithAuth,
  uploadDataWithAuth,
} from "@/app/core/http-service/http-service";
import { extractActionErrorMessage } from "@/app/_actions/extract-action-error";
import type {
  CheckoutBody,
  OrderListResponse,
  OrderRead,
} from "@/types/order.api";
import type { ActionResult } from "@/types/action.types";

/** `POST /orders/checkout` — هدر `X-Cart-Token` برای ادغام سبد مهمان لازم است */
export async function checkoutAction(
  body: CheckoutBody,
  cartToken?: string
): Promise<ActionResult<OrderRead>> {
  try {
    const data = await createDataWithAuth<CheckoutBody, OrderRead>(
      "/orders/checkout",
      body,
      cartToken
    );
    return { success: true, data };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در ثبت سفارش"),
    };
  }
}

/** `POST /orders/{orderId}/receipt` */
export async function uploadReceiptAction(
  orderId: string,
  formData: FormData
): Promise<ActionResult<OrderRead>> {
  try {
    const data = await uploadDataWithAuth<OrderRead>(
      `/orders/${orderId}/receipt`,
      formData
    );
    return { success: true, data };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در آپلود رسید"),
    };
  }
}

/** `GET /payment-info` */
export async function getPaymentInfoAction() {
  try {
    const data = await readData<import("@/types/payment.api").PaymentInfo>(
      "/payment-info"
    );
    return { success: true as const, data };
  } catch (err: unknown) {
    return {
      success: false as const,
      error: extractActionErrorMessage(err, "خطا در دریافت اطلاعات پرداخت"),
    };
  }
}

/** `GET /orders` */
export async function listOrdersAction(
  page = 1,
  pageSize = 20
): Promise<ActionResult<OrderListResponse>> {
  try {
    const data = await readDataWithAuth<OrderListResponse>(
      `/orders?page=${page}&pageSize=${pageSize}`
    );
    return {
      success: true,
      data: {
        orders: data.orders ?? [],
        total: data.total ?? 0,
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت سفارش‌ها"),
    };
  }
}

/** `GET /orders/{orderId}` */
export async function getOrderAction(
  orderId: string
): Promise<ActionResult<OrderRead>> {
  try {
    const data = await readDataWithAuth<OrderRead>(`/orders/${orderId}`);
    return { success: true, data };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت سفارش"),
    };
  }
}
