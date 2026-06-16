"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminSignInAction } from "@/app/_actions/admin-auth-actions";
import { useSessionStore } from "@/app/_store/auth-store";
import { notifyError, notifySuccess } from "@/lib/notify-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const router = useRouter();
  const updateSession = useSessionStore((s) => s.updateSession);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await adminSignInAction({
        username: username.trim(),
        password,
      });

      if (result.success) {
        await updateSession();
        notifySuccess("ورود با موفقیت انجام شد");
        router.replace("/admin/reports");
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
        <h1 className="text-xl font-bold">ورود مدیر</h1>
        <p className="text-xs text-muted-foreground">
          فقط حساب ادمین — ثبت‌نام در دسترس نیست
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-username">نام کاربری</Label>
        <Input
          id="admin-username"
          type="text"
          autoComplete="username"
          dir="ltr"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="admin"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">رمز عبور</Label>
        <Input
          id="password"
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
    </form>
  );
}
