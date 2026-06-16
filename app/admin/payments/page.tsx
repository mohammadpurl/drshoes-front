import { AdminOrdersList } from "@/components/admin/admin-orders-list";

export default function AdminPaymentsPage() {
  return (
    <AdminOrdersList
      title="پرداخت‌ها"
      defaultPaymentStatus="pending_review"
    />
  );
}
