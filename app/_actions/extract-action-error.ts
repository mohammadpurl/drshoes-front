import type { ApiError } from "@/types/http-errors.interface";

export function extractActionErrorMessage(
  err: unknown,
  fallback: string
): string {
  if (err && typeof err === "object") {
    const e = err as ApiError;
    if (typeof e.message === "string" && e.message.trim()) return e.message;
    if (typeof e.detail === "string" && e.detail.trim()) return e.detail;
    if (typeof e.title === "string" && e.title.trim()) return e.title;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
