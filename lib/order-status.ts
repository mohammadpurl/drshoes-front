const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار پرداخت",
  confirmed: "تأیید شده",
  preparing: "در حال آماده‌سازی",
  shipped: "ارسال شده",
  delivered: "تحویل داده شده",
  cancelled: "لغو شده",
};

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  confirmed: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  preparing: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  shipped: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  delivered: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  cancelled: "bg-muted text-muted-foreground",
};

const AWAITING_CONFIRMATION_STYLE =
  "bg-blue-500/10 text-blue-700 dark:text-blue-400";

export type OrderDisplayInput = {
  status: string;
  paymentStatus?: string | null;
  receiptUrl?: string | null;
};

function normalizePaymentStatus(status?: string | null): string {
  return (status ?? "").trim().toLowerCase().replace(/-/g, "_");
}

function isAwaitingConfirmation(order: OrderDisplayInput): boolean {
  const payment = normalizePaymentStatus(order.paymentStatus);
  if (payment === "pending_review") return true;
  if (payment === "verified" || payment === "rejected") return false;
  return Boolean(order.receiptUrl) && order.status === "pending";
}

export function needsPaymentReview(order: OrderDisplayInput): boolean {
  return isAwaitingConfirmation(order);
}

export function orderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function orderStatusClass(status: string): string {
  return ORDER_STATUS_STYLES[status] ?? ORDER_STATUS_STYLES.pending;
}

/** وضعیت نمایشی سفارش با در نظر گرفتن پرداخت و رسید */
export function orderDisplayStatusLabel(order: OrderDisplayInput): string {
  const payment = normalizePaymentStatus(order.paymentStatus);

  if (payment === "pending_review" || isAwaitingConfirmation(order)) {
    return "در انتظار تأیید";
  }
  if (payment === "awaiting_receipt") {
    return "در انتظار پرداخت";
  }
  if (payment === "rejected") {
    return "رسید رد شد";
  }
  if (payment === "verified") {
    return orderStatusLabel(order.status);
  }
  if (order.status === "pending") {
    return "در انتظار پرداخت";
  }

  return orderStatusLabel(order.status);
}

export function orderDisplayStatusClass(order: OrderDisplayInput): string {
  const payment = normalizePaymentStatus(order.paymentStatus);

  if (payment === "pending_review" || isAwaitingConfirmation(order)) {
    return AWAITING_CONFIRMATION_STYLE;
  }
  if (payment === "awaiting_receipt") {
    return ORDER_STATUS_STYLES.pending;
  }
  if (payment === "rejected") {
    return "bg-red-500/10 text-red-700 dark:text-red-400";
  }

  return orderStatusClass(order.status);
}

export function formatOrderDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
