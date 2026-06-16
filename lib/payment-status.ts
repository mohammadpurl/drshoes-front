const PAYMENT_STATUS_LABELS: Record<string, string> = {
  awaiting_receipt: "در انتظار رسید",
  pending_review: "در انتظار تأیید",
  verified: "پرداخت تأیید شد",
  rejected: "رسید رد شد",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  awaiting_receipt: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  pending_review: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  verified: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  rejected: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export function paymentStatusLabel(status: string): string {
  return PAYMENT_STATUS_LABELS[status] ?? status;
}

export function paymentStatusClass(status: string): string {
  return PAYMENT_STATUS_STYLES[status] ?? PAYMENT_STATUS_STYLES.awaiting_receipt;
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/(.{4})/g, "$1 ").trim();
}
