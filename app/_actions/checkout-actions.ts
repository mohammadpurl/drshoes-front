"use server";

import {
  createDataWithAuth,
  readData,
  uploadDataWithAuth,
} from "@/app/core/http-service/http-service";
import { extractActionErrorMessage } from "@/app/_actions/extract-action-error";
import type { CheckoutBody, OrderRead } from "@/types/order.api";
import type { PaymentSettingsRead, PaymentInfo } from "@/types/payment.api";
import { normalizePaymentSettings } from "@/lib/payment-settings";
import type { ActionResult } from "@/types/action.types";

/** `GET /payment-info` */
export async function getPaymentSettingsAction(): Promise<
  ActionResult<PaymentSettingsRead>
> {
  try {
    const data = await readData<PaymentInfo>("/payment-info");
    return { success: true, data: normalizePaymentSettings(data) };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت اطلاعات پرداخت"),
    };
  }
}

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
export async function uploadPaymentReceiptAction(
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
