"use server";

import { readDataWithAuth } from "@/app/core/http-service/http-service";
import { extractActionErrorMessage } from "@/app/_actions/extract-action-error";

export type ProfileData = {
  id: number | string;
  name?: string;
  email?: string;
  avatarUrl?: string;
};

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getProfileAction(): Promise<ActionResult<ProfileData>> {
  try {
    const data = await readDataWithAuth<ProfileData>("/profile/me");
    return { success: true, data };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت پروفایل"),
    };
  }
}
