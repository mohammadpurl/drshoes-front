import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminIndexPage() {
  return (
    <AdminShell>
      <AdminDashboard />
    </AdminShell>
  );
}
