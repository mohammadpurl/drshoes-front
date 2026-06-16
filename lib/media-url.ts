/** تصاویر آپلودشده از بک‌اند (لوکال یا CDN) */
export function isBackendMediaUrl(url: string): boolean {
  const value = url?.trim();
  if (!value) return false;

  if (value.includes("/api/v1/media/")) return true;
  if (value.includes("/static/products/")) return true;

  return false;
}

/** مسیرهای public فرانت یا رسانه بک‌اند — بدون بهینه‌ساز Next Image */
export function shouldUseUnoptimizedImage(url: string): boolean {
  const value = url?.trim();
  if (!value) return false;

  if (value.startsWith("/images/")) return true;
  return isBackendMediaUrl(value);
}
