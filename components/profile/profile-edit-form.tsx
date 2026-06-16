"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  AtSign,
  Loader2,
  Mail,
  MapPin,
  Smartphone,
  Upload,
  User,
} from "lucide-react";
import {
  getCustomerProfileAction,
  updateCustomerProfileAction,
} from "@/app/_actions/customer-profile-actions";
import { useSessionStore } from "@/app/_store/auth-store";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinFullName, splitFullName } from "@/lib/profile-name";
import { loadProfileExtra, saveProfileExtra } from "@/lib/profile-storage";
import { notifyError, notifySuccess } from "@/lib/notify-action";
import { emptyProfile, useProfileStore } from "@/store/profile-store";
import type { ProfileFormValues } from "@/types/profile.api";
import { cn } from "@/lib/utils";

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground">
      {children}
    </span>
  );
}

function IconInput({
  id,
  icon,
  className,
  ...props
}: React.ComponentProps<typeof Input> & {
  icon: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Input id={id} className={cn("pe-10", className)} {...props} />
      <FieldIcon>{icon}</FieldIcon>
    </div>
  );
}

function resolveAvatarUrl(data: {
  avatarUrl?: string | null;
  avatar_url?: string | null;
  url?: string | null;
}): string | null {
  return data.avatarUrl ?? data.avatar_url ?? data.url ?? null;
}

export function ProfileEditForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ProfileFormValues>(emptyProfile);

  const session = useSessionStore((s) => s.session);
  const updateSession = useSessionStore((s) => s.updateSession);
  const setProfileStore = useProfileStore((s) => s.setProfile);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    const result = await getCustomerProfileAction();
    setLoading(false);

    if (!result.success) {
      notifyError(result.error);
      return;
    }

    const api = result.data;
    const extra = loadProfileExtra(api.id);
    const fromApi = splitFullName(api.full_name ?? "");

    const merged: ProfileFormValues = {
      firstName: extra.firstName ?? fromApi.firstName,
      lastName: extra.lastName ?? fromApi.lastName,
      phone: api.phone ?? api.username ?? "",
      email: extra.email ?? api.email ?? "",
      nationalId: extra.nationalId ?? api.national_id ?? "",
      postalCode: extra.postalCode ?? api.postal_code ?? "",
      addressLine: extra.addressLine ?? api.address_line ?? "",
      avatarUrl: extra.avatarUrl ?? api.avatar_url ?? null,
    };

    setForm(merged);
    setProfileStore(api.id, merged);
  }, [setProfileStore]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const updateField = <K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleAvatarUpload = async (file: File) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body,
        credentials: "include",
      });

      const payload = (await response.json()) as {
        success?: boolean;
        error?: string;
        data?: { avatarUrl?: string; avatar_url?: string; url?: string };
      };

      if (!response.ok || !payload.success) {
        notifyError(payload.error ?? "خطا در بارگذاری تصویر");
        return;
      }

      const avatarUrl = resolveAvatarUrl(payload.data ?? {});
      if (avatarUrl) {
        updateField("avatarUrl", avatarUrl);
        if (session?.userId) {
          setProfileStore(session.userId, { ...form, avatarUrl });
        }
        notifySuccess("تصویر پروفایل به‌روزرسانی شد");
      }
    } catch {
      notifyError("خطا در بارگذاری تصویر");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.firstName.trim()) {
      notifyError("نام الزامی است");
      return;
    }

    startTransition(async () => {
      const fullName = joinFullName(form.firstName, form.lastName);
      const userId = session?.userId;

      const apiResult = await updateCustomerProfileAction({
        full_name: fullName,
        email: form.email.trim() || null,
        national_id: form.nationalId.trim() || null,
        postal_code: form.postalCode.trim() || null,
        address_line: form.addressLine.trim() || null,
      });

      if (userId) {
        saveProfileExtra(userId, {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          nationalId: form.nationalId.trim(),
          postalCode: form.postalCode.trim(),
          addressLine: form.addressLine.trim(),
          avatarUrl: form.avatarUrl,
        });
        setProfileStore(userId, form);
      }

      if (apiResult.success) {
        const api = apiResult.data;
        const fromApi = splitFullName(api.full_name ?? fullName);
        const nextForm: ProfileFormValues = {
          firstName: fromApi.firstName || form.firstName,
          lastName: fromApi.lastName || form.lastName,
          phone: api.phone ?? form.phone,
          email: api.email ?? form.email,
          nationalId: api.national_id ?? form.nationalId,
          postalCode: api.postal_code ?? form.postalCode,
          addressLine: api.address_line ?? form.addressLine,
          avatarUrl: api.avatar_url ?? form.avatarUrl,
        };
        setForm(nextForm);
        if (userId) setProfileStore(userId, nextForm);
        await updateSession();
        notifySuccess("تغییرات با موفقیت ذخیره شد");
        return;
      }

      notifyError(apiResult.error);
    });
  };

  if (loading) {
    return (
      <p className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        در حال بارگذاری پروفایل...
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-dashed border-border bg-card/50 p-6">
        <div className="flex flex-col items-center text-center">
          <ProfileAvatar
            src={form.avatarUrl}
            size="lg"
            className="mb-4"
          />

          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            فرمت تصویر WebP، JPG یا PNG و برای نمایش بهتر ابعاد ۵۱۲×۵۱۲
            پیکسل پیشنهاد می‌شود.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleAvatarUpload(file);
              event.target.value = "";
            }}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "در حال بارگذاری..." : "بارگذاری تصویر"}
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-first-name">نام</Label>
            <IconInput
              id="profile-first-name"
              icon={<User className="h-4 w-4" />}
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder="نام"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-last-name">نام خانوادگی</Label>
            <IconInput
              id="profile-last-name"
              icon={<User className="h-4 w-4" />}
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="نام خانوادگی"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-phone">موبایل (نام کاربری)</Label>
            <IconInput
              id="profile-phone"
              icon={<Smartphone className="h-4 w-4" />}
              value={form.phone}
              readOnly
              dir="ltr"
              className="bg-muted/60"
            />
            <p className="text-xs text-muted-foreground">
              موبایل غیرقابل ویرایش است.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-email">ایمیل</Label>
            <IconInput
              id="profile-email"
              type="email"
              icon={<AtSign className="h-4 w-4" />}
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="ایمیل خود را وارد کنید"
              dir="ltr"
            />
            <p className="text-xs text-muted-foreground" dir="ltr">
              مثال: user@example.com
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-national-id">کد ملی</Label>
            <IconInput
              id="profile-national-id"
              icon={<User className="h-4 w-4" />}
              value={form.nationalId}
              onChange={(e) => updateField("nationalId", e.target.value)}
              placeholder="کد ملی خود را وارد کنید"
              dir="ltr"
              inputMode="numeric"
            />
            <p className="text-xs text-muted-foreground" dir="ltr">
              مثال: 4073343489
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-postal-code">کد پستی</Label>
            <IconInput
              id="profile-postal-code"
              icon={<Mail className="h-4 w-4" />}
              value={form.postalCode}
              onChange={(e) => updateField("postalCode", e.target.value)}
              placeholder="کد پستی خود را وارد کنید"
              dir="ltr"
              inputMode="numeric"
            />
            <p className="text-xs text-muted-foreground" dir="ltr">
              مثال: 1415465841
            </p>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="profile-address">آدرس</Label>
            <div className="relative">
              <Input
                id="profile-address"
                value={form.addressLine}
                onChange={(e) => updateField("addressLine", e.target.value)}
                placeholder="آدرس خود را وارد کنید"
                className="pe-10"
              />
              <FieldIcon>
                <MapPin className="h-4 w-4" />
              </FieldIcon>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" size="lg" disabled={pending} className="min-w-40">
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              "ثبت تغییرات"
            )}
          </Button>
        </div>
      </section>
    </form>
  );
}
