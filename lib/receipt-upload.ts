const MAX_RECEIPT_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

export function validateReceiptFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "فرمت مجاز: JPG، PNG، WEBP یا PDF";
  }
  if (file.size > MAX_RECEIPT_BYTES) {
    return "حداکثر حجم فایل ۵ مگابایت است";
  }
  return null;
}
