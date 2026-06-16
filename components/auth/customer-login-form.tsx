"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { customerSignInAction } from "@/app/_actions/customer-auth-actions";
import { useSessionStore } from "@/app/_store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useCartActions } from "@/hooks/use-cart-actions";
import { notifyError, notifySuccess } from "@/lib/notify-action";
import { readCartToken } from "@/lib/cart-token";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateSession = useSessionStore((s) => s.updateSession);
  const { refreshCart } = useCartActions();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();

  const redirectTo = searchParams.get("redirect") || "/profile";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const guestCartToken =
        useCartStore.getState().cartToken ?? readCartToken() ?? undefined;

      const result = await customerSignInAction(
        {
          username: username.trim(),
          password,
        },
        guestCartToken
      );

      if (result.success) {
        await updateSession();
        await refreshCart();
        useCartStore.getState().setCartToken(null);
        notifySuccess("ورود با موفقیت انجام شد");
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
        <h1 className="text-xl font-bold">ورود</h1>
        <p className="text-xs text-muted-foreground">
          با نام کاربری و رمز عبور وارد شوید
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-username">نام کاربری</Label>
        <Input
          id="login-username"
          type="text"
          autoComplete="username"
          dir="ltr"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">رمز عبور</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "در حال ورود..." : "ورود"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        حساب ندارید؟{" "}
        <Link
          href={
            redirectTo !== "/profile"
              ? `/register?redirect=${encodeURIComponent(redirectTo)}`
              : "/register"
          }
          className="font-medium text-primary hover:underline"
        >
          ثبت‌نام
        </Link>
      </p>
    </form>
  );
}
