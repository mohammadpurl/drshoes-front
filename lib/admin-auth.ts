import type { UserSession } from "@/app/(auth)/_types/auth.types";
import { permissionMatches } from "@/lib/permissions";

export function isAdminSession(
  session: UserSession | null | undefined
): boolean {
  if (!session) return false;

  const roles = session.roles ?? [];
  if (roles.includes("admin") || roles.includes("Admin")) {
    return true;
  }

  const permissions = session.permissions ?? [];
  return permissionMatches(permissions, "admin.manage");
}
