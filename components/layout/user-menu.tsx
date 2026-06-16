"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { customerSignOutAction } from "@/app/_actions/customer-auth-actions";
import { useSessionStore } from "@/app/_store/auth-store";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProfileDisplayName } from "@/lib/profile-display";
import { notifySuccess } from "@/lib/notify-action";
import { useProfileStore } from "@/store/profile-store";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const status = useSessionStore((s) => s.status);
  const session = useSessionStore((s) => s.session);
  const clearSession = useSessionStore((s) => s.clearSession);
  const updateSession = useSessionStore((s) => s.updateSession);
  const profile = useProfileStore((s) => s.profile);
  const clearProfile = useProfileStore((s) => s.clearProfile);

  const isAuthenticated = status === "authenticated" && session;
  const isLoading = status === "loading";
  const displayName = getProfileDisplayName(profile, session);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const handleOpen = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const handleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, [clearCloseTimer]);

  const handleSignOut = () => {
    setOpen(false);
    startTransition(async () => {
      await customerSignOutAction();
      clearSession();
      clearProfile();
      await updateSession();
      notifySuccess("خروج انجام شد");
      router.refresh();
    });
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative shrink-0"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <Button
        variant="ghost"
        size="icon"
        type="button"
        aria-label="حساب کاربری"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <User className="h-5 w-5" />
      </Button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute end-0 top-full z-50 mt-2 w-64 rounded-2xl border border-border bg-card p-4 shadow-lg",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150"
          )}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          {isLoading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              در حال بارگذاری...
            </p>
          ) : isAuthenticated ? (
            <>
              <div className="flex flex-col items-center gap-2 pb-3 text-center">
                <ProfileAvatar src={profile?.avatarUrl} size="sm" className="h-14 w-14" />
                <p className="text-sm font-bold leading-snug">{displayName}</p>
                {session.userName && session.userName !== displayName && (
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {session.userName}
                  </p>
                )}
              </div>

              <Separator className="mb-2" />

              <Link
                href="/profile/settings"
                role="menuitem"
                className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                <span>پنل کاربری</span>
                <User className="h-4 w-4 text-muted-foreground" />
              </Link>

              <Separator className="my-2" />

              <button
                type="button"
                role="menuitem"
                disabled={pending}
                onClick={handleSignOut}
                className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm text-destructive transition hover:bg-destructive/10 disabled:opacity-60"
              >
                <span>{pending ? "در حال خروج..." : "خروج از حساب کاربری"}</span>
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="space-y-3 py-1">
              <div className="flex flex-col items-center gap-2 text-center">
                <ProfileAvatar size="sm" className="h-14 w-14 bg-muted" />
                <p className="text-sm font-medium">کاربر مهمان</p>
                <p className="text-xs text-muted-foreground">
                  برای پیگیری سفارش وارد شوید
                </p>
              </div>
              <Button className="w-full" size="sm" asChild>
                <Link href="/login" onClick={() => setOpen(false)}>
                  ورود
                </Link>
              </Button>
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link href="/register" onClick={() => setOpen(false)}>
                  ثبت‌نام
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
