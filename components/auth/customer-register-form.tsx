"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { customerRegisterAction } from "@/app/_actions/customer-auth-actions";
import { useSessionStore } from "@/app/_store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useCartActions } from "@/hooks/use-cart-actions";
import { notifyError, notifySuccess } from "@/lib/notify-action";
import { readCartToken } from "@/lib/cart-token";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomerRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateSession = useSessionStore((s) => s.updateSession);
  const { refreshCart } = useCartActions();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();

  const redirectTo = searchParams.get("redirect") || "/profile";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      notifyError("شماره موبایل الزامی است");
      return;
    }

    startTransition(async () => {
      const guestCartToken =
        useCartStore.getState().cartToken ?? readCartToken() ?? undefined;

      const result = await customerRegisterAction(
        {
          fullName: fullName.trim(),
          username: username.trim(),
          password,
          phone: phone.trim(),
        },
        guestCartToken
      );

      if (result.success) {
        await updateSession();
        await refreshCart();
        useCartStore.getState().setCartToken(null);
        notifySuccess("ثبت‌نام با موفقیت انجام شد");
        router.replace(redirectTo);
        return;
      }

      notifyError(result.error);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-bold">ثبت‌نام</h1>
        <p className="text-xs text-muted-foreground">
          حساب جدید با نام کاربری و موبایل بسازید
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-name">نام و نام خانوادگی</Label>
        <Input
          id="register-name"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="علی رضایی"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-username">نام کاربری</Label>
        <Input
          id="register-username"
          type="text"
          autoComplete="username"
          dir="ltr"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ali_rezaei"
          minLength={3}
          required
        />
        <p className="text-[11px] text-muted-foreground">
          برای ورود بعدی از همین نام کاربری استفاده می‌کنید
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-phone">شماره موبایل</Label>
        <Input
          id="register-phone"
          type="tel"
          autoComplete="tel"
          dir="ltr"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="09121234567"
          pattern="09[0-9]{9}"
          title="شماره موبایل معتبر ایران (مثلاً 09121234567)"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">رمز عبور</Label>
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "در حال ثبت‌نام..." : "ثبت‌نام"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link
          href={
            redirectTo !== "/profile"
              ? `/login?redirect=${encodeURIComponent(redirectTo)}`
              : "/login"
          }
          className="font-medium text-primary hover:underline"
        >
          ورود
        </Link>
      </p>
    </form>
  );
}
