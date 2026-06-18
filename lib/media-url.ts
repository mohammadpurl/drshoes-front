/** تصاویر آپلودشده از بک‌اند (لوکال یا CDN) */
export function isBackendMediaUrl(url: string): boolean {
  const value = url?.trim();
  if (!value) return false;

  if (value.includes("/api/v1/media/")) return true;
  if (value.includes("/static/products/")) return true;

  return false;
}

/** Supabase Storage public object URLs */
export function isSupabaseStorageUrl(url: string): boolean {
  const value = url?.trim();
  if (!value) return false;

  try {
    const { hostname, pathname } = new URL(value);
    return (
      hostname.endsWith(".supabase.co") &&
      pathname.includes("/storage/v1/object/")
    );
  } catch {
    return false;
  }
}

/** مسیرهای public فرانت، بک‌اند، یا Supabase — بدون بهینه‌ساز Next Image */
export function shouldUseUnoptimizedImage(url: string): boolean {
  const value = url?.trim();
  if (!value) return false;

  if (value.startsWith("/images/")) return true;
  if (isSupabaseStorageUrl(value)) return true;
  return isBackendMediaUrl(value);
}
