export type OrderItemRead = {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  brand: string;
  imageUrl?: string | null;
  size: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type CheckoutBody = {
  addressId: string;
  notes?: string;
};

export type OrderRead = {
  id: string;
  status: string;
  paymentStatus: string;
  receiptUrl?: string | null;
  receiptNote?: string | null;
  receiptUploadedAt?: string | null;
  paymentReviewNote?: string | null;
  subtotal: number;
  shippingCost: number;
  total: number;
  notes?: string | null;
  shippingFullName: string;
  shippingPhone: string;
  shippingProvince: string;
  shippingCity: string;
  shippingAddress: string;
  shippingPostalCode: string;
  shippingMethod?: string | null;
  trackingNumber?: string | null;
  shippingNote?: string | null;
  shippedAt?: string | null;
  createdAt: string;
  items: OrderItemRead[];
};

export type OrderListResponse = {
  orders: OrderRead[];
  total: number;
};

export type AdminOrderRead = OrderRead & {
  userId: string;
  username?: string | null;
  userFullName?: string | null;
  userPhone?: string | null;
};

export type AdminOrderListResponse = {
  orders: AdminOrderRead[];
  total: number;
};

export type OrderFulfillmentUpdate = {
  status?: string;
  shippingMethod?: string | null;
  trackingNumber?: string | null;
  shippingNote?: string | null;
};
