const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => persianDigits[parseInt(d, 10)]);
}

export function formatToman(
  amount: number,
  options?: { persianDigits?: boolean }
): string {
  const formatted = amount.toLocaleString("fa-IR");
  if (options?.persianDigits) {
    return `${toPersianDigits(formatted)} تومان`;
  }
  return `${formatted} تومان`;
}
