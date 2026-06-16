"use server";

/**
 * نقطه ورود آپلود رسانه محصول.
 *
 * local → public/images/Products/{slug}/  (توسعه بدون بک‌اند)
 * s3    → POST /admin/uploads/media?slug=... (بک‌اند + static)
 */

import { getMediaStorageMode } from "@/lib/media-storage";
import { uploadProductMediaLocalAction } from "@/app/_actions/product-media-actions.local";
import { uploadProductMediaS3Action } from "@/app/_actions/product-media-actions.s3";

export type { ProductMediaUploadResult } from "@/app/_actions/upload-actions";

export async function uploadProductMediaAction(formData: FormData) {
  if (getMediaStorageMode() === "s3") {
    return uploadProductMediaS3Action(formData);
  }
  return uploadProductMediaLocalAction(formData);
}
