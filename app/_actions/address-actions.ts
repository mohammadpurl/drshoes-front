"use server";

import {
  createDataWithAuth,
  deleteDataWithAuth,
  patchDataWithAuth,
  readDataWithAuth,
} from "@/app/core/http-service/http-service";
import { extractActionErrorMessage } from "@/app/_actions/extract-action-error";
import type {
  AddressCreateBody,
  AddressRead,
  AddressUpdateBody,
} from "@/types/address.api";
import type { ActionResult, ActionVoidResult } from "@/types/action.types";

function normalizeAddressList(data: unknown): AddressRead[] {
  if (Array.isArray(data)) return data as AddressRead[];
  if (data && typeof data === "object" && Array.isArray((data as { items?: unknown }).items)) {
    return (data as { items: AddressRead[] }).items;
  }
  if (data && typeof data === "object" && Array.isArray((data as { addresses?: unknown }).addresses)) {
    return (data as { addresses: AddressRead[] }).addresses;
  }
  return [];
}

/** `GET /addresses` */
export async function listAddressesAction(): Promise<
  ActionResult<AddressRead[]>
> {
  try {
    const data = await readDataWithAuth<unknown>("/addresses");
    return { success: true, data: normalizeAddressList(data) };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت آدرس‌ها"),
    };
  }
}

/** `POST /addresses` */
export async function createAddressAction(
  body: AddressCreateBody
): Promise<ActionResult<AddressRead>> {
  try {
    const data = await createDataWithAuth<AddressCreateBody, AddressRead>(
      "/addresses",
      body
    );
    return { success: true, data };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در افزودن آدرس"),
    };
  }
}

/** `PATCH /addresses/{addressId}` */
export async function updateAddressAction(
  addressId: string,
  body: AddressUpdateBody
): Promise<ActionResult<AddressRead>> {
  try {
    const data = await patchDataWithAuth<AddressUpdateBody, AddressRead>(
      `/addresses/${addressId}`,
      body
    );
    return { success: true, data };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در به‌روزرسانی آدرس"),
    };
  }
}

/** `DELETE /addresses/{addressId}` */
export async function deleteAddressAction(
  addressId: string
): Promise<ActionVoidResult> {
  try {
    await deleteDataWithAuth(`/addresses/${addressId}`);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در حذف آدرس"),
    };
  }
}
