export const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const VIDEO_MIME_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export function validateMediaFile(file: File): string | null {
  const isImage = IMAGE_MIME_TYPES.has(file.type);
  const isVideo = VIDEO_MIME_TYPES.has(file.type);

  if (!isImage && !isVideo) {
    return "فرمت مجاز: JPG، PNG، WebP، GIF، MP4 یا WebM";
  }
  if (isImage && file.size > MAX_IMAGE_BYTES) {
    return "حجم تصویر باید حداکثر ۱۰ مگابایت باشد";
  }
  if (isVideo && file.size > MAX_VIDEO_BYTES) {
    return "حجم ویدئو باید حداکثر ۱۰۰ مگابایت باشد";
  }
  return null;
}

export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}
