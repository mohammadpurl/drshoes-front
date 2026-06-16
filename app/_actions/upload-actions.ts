"use server";

import { readDataWithAuth, uploadDataWithAuth } from "@/app/core/http-service/http-service";
import { extractActionErrorMessage } from "@/app/_actions/extract-action-error";
import { validateMediaFile } from "@/lib/media-upload";
import type { ActionResult } from "@/types/action.types";
import type { MediaUploadResponse, SuggestSlugResponse } from "@/types/upload.api";

export type ProductMediaUploadData = {
  url: string;
  key?: string;
  kind: "image" | "video";
  contentType?: string;
};

export type ProductMediaUploadResult = ActionResult<ProductMediaUploadData>;

/** `GET /admin/uploads/suggest-slug?name=...` */
export async function suggestProductSlugAction(
  name: string
): Promise<ActionResult<string>> {
  try {
    const q = encodeURIComponent(name.trim());
    const data = await readDataWithAuth<SuggestSlugResponse>(
      `/admin/uploads/suggest-slug?name=${q}`
    );
    return { success: true, data: data.slug };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در پیشنهاد اسلاگ"),
    };
  }
}

/**
 * `POST /admin/uploads/media?slug=...`
 * multipart: file
 */
export async function uploadProductMediaBackendAction(
  formData: FormData
): Promise<ProductMediaUploadResult> {
  try {
    const file = formData.get("file");
    const slug = formData.get("slug");

    if (!(file instanceof File)) {
      return { success: false, error: "فایل یافت نشد" };
    }

    const slugValue = typeof slug === "string" ? slug.trim() : "";
    if (!slugValue) {
      return {
        success: false,
        error: "قبل از آپلود، اسلاگ محصول را وارد کنید",
      };
    }

    const validationError = validateMediaFile(file);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const body = new FormData();
    body.append("file", file);

    const data = await uploadDataWithAuth<MediaUploadResponse>(
      `/admin/uploads/media?slug=${encodeURIComponent(slugValue)}`,
      body
    );

    if (!data.url) {
      return {
        success: false,
        error: "آدرس فایل از سرور برنگشت",
      };
    }

    return {
      success: true,
      data: {
        url: data.url,
        key: data.key,
        kind: data.kind ?? (file.type.startsWith("video/") ? "video" : "image"),
        contentType: data.contentType ?? file.type,
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در آپلود فایل"),
    };
  }
}
