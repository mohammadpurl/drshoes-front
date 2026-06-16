"use server";

/**
 * آپلود رسانه در پوشه public/images/Products/{slug}/
 * حالت پیش‌فرض تا اتصال بک‌اند به S3 آماده شود.
 */

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getSession } from "@/app/utils/session";
import { isAdminSession } from "@/lib/admin-auth";
import { validateMediaFile } from "@/lib/media-upload";
import {
  LOCAL_PRODUCT_MEDIA_DIR,
  LOCAL_PRODUCT_MEDIA_URL_PREFIX,
  extensionFromMime,
  sanitizeProductSlug,
} from "@/lib/media-storage";
import type { ProductMediaUploadResult } from "@/app/_actions/upload-actions";


export async function uploadProductMediaLocalAction(
  formData: FormData
): Promise<ProductMediaUploadResult> {
  try {
    const session = await getSession();
    if (!isAdminSession(session)) {
      return { success: false, error: "دسترسی ادمین لازم است" };
    }

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

    const safeSlug = sanitizeProductSlug(slugValue);
    if (!safeSlug) {
      return { success: false, error: "اسلاگ معتبر نیست" };
    }

    const ext = extensionFromMime(file.type);
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    const dir = path.join(process.cwd(), LOCAL_PRODUCT_MEDIA_DIR, safeSlug);
    await mkdir(dir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const diskPath = path.join(dir, fileName);
    await writeFile(diskPath, buffer);

    const publicUrl = `${LOCAL_PRODUCT_MEDIA_URL_PREFIX}/${safeSlug}/${fileName}`;

    return {
      success: true,
      data: {
        url: publicUrl,
        key: `${safeSlug}/${fileName}`,
        kind: file.type.startsWith("video/") ? "video" : "image",
        contentType: file.type,
      },
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "خطا در ذخیره فایل روی دیسک";
    return { success: false, error: message };
  }
}
