import { AdminOrdersList } from "@/components/admin/admin-orders-list";

type AdminOrdersPageProps = {
  searchParams: Promise<{
    status?: string;
    payment?: string;
  }>;
};

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const params = await searchParams;

  return (
    <AdminOrdersList
      defaultStatus={params.status}
      defaultPaymentStatus={params.payment}
    />
  );
}
