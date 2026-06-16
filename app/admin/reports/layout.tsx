import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
