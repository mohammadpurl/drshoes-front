/** local = ذخیره در public/images/Products | s3 = آپلود به بک‌اند/MinIO */
export type MediaStorageMode = "local" | "s3";

export function getMediaStorageMode(): MediaStorageMode {
  const mode = process.env.MEDIA_STORAGE?.trim().toLowerCase();
  return mode === "s3" ? "s3" : "local";
}

/** مسیر فیزیکی نسبت به ریشه پروژه */
export const LOCAL_PRODUCT_MEDIA_DIR = "public/images/Products";

/** پیشوند URL عمومی برای فایل‌های محلی */
export const LOCAL_PRODUCT_MEDIA_URL_PREFIX = "/images/Products";

export function sanitizeProductSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

export function extensionFromMime(mime: string): string {
  return MIME_TO_EXT[mime] ?? ".bin";
}
