export function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
}

export function requireApiBase(): string {
  const base = getApiBase();
  if (!base) {
    throw new Error(
      "آدرس API تنظیم نشده است. NEXT_PUBLIC_API_URL را در فایل .env.local قرار دهید."
    );
  }
  return base;
}
