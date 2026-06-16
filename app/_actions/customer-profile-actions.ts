"use server";

import {
  patchDataWithAuth,
  readDataWithAuth,
} from "@/app/core/http-service/http-service";
import { extractActionErrorMessage } from "@/app/_actions/extract-action-error";
import type {
  CustomerProfileRead,
  CustomerProfileUpdateBody,
} from "@/types/profile.api";
import type { ActionResult } from "@/types/action.types";

/** `GET /auth/me` */
export async function getCustomerProfileAction(): Promise<
  ActionResult<CustomerProfileRead>
> {
  try {
    const data = await readDataWithAuth<CustomerProfileRead>("/auth/me");
    return { success: true, data };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت پروفایل"),
    };
  }
}

/** `PATCH /auth/me` — اگر بک‌اند پشتیبانی کند */
export async function updateCustomerProfileAction(
  body: CustomerProfileUpdateBody
): Promise<ActionResult<CustomerProfileRead>> {
  try {
    const data = await patchDataWithAuth<
      CustomerProfileUpdateBody,
      CustomerProfileRead
    >("/auth/me", body);
    return { success: true, data };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در ذخیره پروفایل"),
    };
  }
}
