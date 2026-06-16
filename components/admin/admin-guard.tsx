"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSessionStore } from "@/app/_store/auth-store";
import { isAdminSession } from "@/lib/admin-auth";

function isPublicAdminPath(pathname: string) {
  return pathname === "/admin/login";
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const status = useSessionStore((s) => s.status);
  const session = useSessionStore((s) => s.session);
  const publicPath = isPublicAdminPath(pathname);
  const admin = isAdminSession(session);

  useEffect(() => {
    if (status === "loading" || publicPath) return;

    if (!admin) {
      router.replace(status === "authenticated" ? "/" : "/admin/login");
    }
  }, [status, admin, publicPath, router]);

  if (publicPath) {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        در حال بارگذاری...
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        در حال انتقال...
      </div>
    );
  }

  return <>{children}</>;
}
