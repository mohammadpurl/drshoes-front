import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
