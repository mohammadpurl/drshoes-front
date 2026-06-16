"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LogOut, Moon, Sun } from "lucide-react";
import { customerSignOutAction } from "@/app/_actions/customer-auth-actions";
import { useSessionStore } from "@/app/_store/auth-store";
import { useTheme } from "@/components/theme-provider";
import { ProfileShell } from "@/components/profile/profile-shell";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { RequireAuth } from "@/components/profile/require-auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { notifySuccess } from "@/lib/notify-action";
import { useProfileStore } from "@/store/profile-store";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const clearSession = useSessionStore((s) => s.clearSession);
  const updateSession = useSessionStore((s) => s.updateSession);
  const clearProfile = useProfileStore((s) => s.clearProfile);
  const { resolvedTheme, setTheme } = useTheme();

  const handleSignOut = () => {
    startTransition(async () => {
      await customerSignOutAction();
      clearSession();
      clearProfile();
      await updateSession();
      notifySuccess("خروج انجام شد");
      router.replace("/profile");
    });
  };

  return (
    <ProfileShell title="ویرایش پروفایل">
      <RequireAuth>
        <ProfileEditForm />

        <section className="mt-6 rounded-2xl border border-border bg-card p-4">
          <h2 className="mb-3 font-semibold">ظاهر برنامه</h2>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <span>تم {resolvedTheme === "dark" ? "تیره" : "روشن"}</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              {resolvedTheme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              تغییر
            </span>
          </Button>
        </section>

        <Separator className="my-6" />

        <Button
          variant="outline"
          className="w-full text-destructive hover:text-destructive"
          onClick={handleSignOut}
          disabled={pending}
        >
          <LogOut className="h-4 w-4" />
          {pending ? "در حال خروج..." : "خروج از حساب کاربری"}
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          برای مدیریت آدرس‌های ارسال به{" "}
          <Link href="/profile/addresses" className="text-primary hover:underline">
            آدرس‌ها
          </Link>{" "}
          و برای سفارش‌ها به{" "}
          <Link href="/profile/orders" className="text-primary hover:underline">
            سفارش‌های من
          </Link>{" "}
          بروید.
        </p>
      </RequireAuth>
    </ProfileShell>
  );
}
