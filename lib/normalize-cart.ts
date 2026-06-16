import type { CartRead } from "@/types/cart.api";

/** نرمال‌سازی شکل‌های مختلف پاسخ API سبد */
export function unwrapCartRead(data: unknown): CartRead {
  if (!data || typeof data !== "object") {
    return { items: [] };
  }

  const record = data as Record<string, unknown>;

  if (Array.isArray(record.items)) {
    return record as unknown as CartRead;
  }

  const nested = record.cart;
  if (nested && typeof nested === "object" && Array.isArray((nested as CartRead).items)) {
    return nested as CartRead;
  }

  return { items: [] };
}

export function extractCartTokenFromBody(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;

  const record = data as Record<string, unknown>;
  const token = record.cartToken;
  if (typeof token === "string" && token.trim()) {
    return token.trim();
  }

  const nested = record.cart;
  if (nested && typeof nested === "object") {
    const nestedToken = (nested as Record<string, unknown>).cartToken;
    if (typeof nestedToken === "string" && nestedToken.trim()) {
      return nestedToken.trim();
    }
  }

  return undefined;
}
