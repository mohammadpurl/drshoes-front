/** کلید persist زustand برای سبد */
const ZUSTAND_CART_KEY = "drshoes-cart";

/** کلید ذخیره توکن مهمان `X-Cart-Token` در مرورگر */
export const CART_TOKEN_STORAGE_KEY = "drshoes-cart-token";

export function readCartToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const dedicated = localStorage.getItem(CART_TOKEN_STORAGE_KEY);
    if (dedicated?.trim()) return dedicated.trim();

    const raw = localStorage.getItem(ZUSTAND_CART_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as {
      state?: { cartToken?: string | null };
    };
    const token = parsed?.state?.cartToken;
    return typeof token === "string" && token.trim() ? token.trim() : null;
  } catch {
    return null;
  }
}

export function writeCartToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem(CART_TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(CART_TOKEN_STORAGE_KEY);
    }
  } catch {
    /* ignore */
  }
}
