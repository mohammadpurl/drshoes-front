"use server";

/**
 * آپلود رسانه به بک‌اند (MinIO/S3) — نگه‌داری برای سازگاری با نام قبلی.
 * @see upload-actions.ts — `uploadProductMediaBackendAction`
 */

import { uploadProductMediaBackendAction } from "@/app/_actions/upload-actions";

export type { ProductMediaUploadResult } from "@/app/_actions/upload-actions";

export async function uploadProductMediaS3Action(
  formData: FormData
) {
  return uploadProductMediaBackendAction(formData);
}
