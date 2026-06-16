"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSessionStore } from "@/app/_store/auth-store";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useSessionStore((s) => s.status);

  useEffect(() => {
    if (status !== "unauthenticated") return;
    router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [status, pathname, router]);

  if (status === "loading") {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        در حال بارگذاری...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        در حال انتقال به صفحه ورود...
      </div>
    );
  }

  return <>{children}</>;
}
