export const SHIPPING_METHOD_OPTIONS = [
  "پست پیشتاز",
  "پست سفارشی",
  "تیپاکس",
  "چاپار",
  "پیک موتوری",
  "تحویل حضوری",
] as const;

export function hasFulfillmentInfo(order: {
  shippingMethod?: string | null;
  trackingNumber?: string | null;
  shippingNote?: string | null;
  shippedAt?: string | null;
}): boolean {
  return Boolean(
    order.shippingMethod ||
      order.trackingNumber ||
      order.shippingNote ||
      order.shippedAt
  );
}

export function isActiveOrderStatus(status: string): boolean {
  return status !== "delivered" && status !== "cancelled";
}
