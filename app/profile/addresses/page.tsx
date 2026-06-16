"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import {
  createAddressAction,
  deleteAddressAction,
  listAddressesAction,
  updateAddressAction,
} from "@/app/_actions/address-actions";
import { ProfileShell } from "@/components/profile/profile-shell";
import { RequireAuth } from "@/components/profile/require-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { notifyError, notifySuccess } from "@/lib/notify-action";
import type { AddressCreateBody, AddressRead } from "@/types/address.api";
import { cn } from "@/lib/utils";

const EMPTY_FORM: AddressCreateBody = {
  title: "",
  fullName: "",
  phone: "",
  province: "",
  city: "",
  addressLine: "",
  postalCode: "",
  isDefault: false,
};

export default function ProfileAddressesPage() {
  const [addresses, setAddresses] = useState<AddressRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressCreateBody>(EMPTY_FORM);
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    const result = await listAddressesAction();
    setLoading(false);
    if (result.success) {
      setAddresses(result.data);
      return;
    }
    notifyError(result.error);
  }, []);

  useEffect(() => {
    void loadAddresses();
  }, [loadAddresses]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (address: AddressRead) => {
    setForm({
      title: address.title,
      fullName: address.fullName,
      phone: address.phone,
      province: address.province,
      city: address.city,
      addressLine: address.addressLine,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = editingId
        ? await updateAddressAction(editingId, form)
        : await createAddressAction(form);

      if (result.success) {
        notifySuccess(editingId ? "آدرس به‌روز شد" : "آدرس اضافه شد");
        resetForm();
        await loadAddresses();
        return;
      }

      notifyError(result.error);
    });
  };

  const askDelete = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;

    startTransition(async () => {
      const result = await deleteAddressAction(deleteId);
      if (result.success) {
        notifySuccess("آدرس حذف شد");
        await loadAddresses();
      } else {
        notifyError(result.error);
      }

      setConfirmOpen(false);
      setDeleteId(null);
    });
  };

  const setDefault = (id: string) => {
    startTransition(async () => {
      const result = await updateAddressAction(id, { isDefault: true });
      if (result.success) {
        notifySuccess("آدرس پیش‌فرض تنظیم شد");
        await loadAddresses();
        return;
      }
      notifyError(result.error);
    });
  };

  return (
    <ProfileShell title="آدرس‌ها">
      <RequireAuth>
        <div className="mb-4 flex items-center justify-end">
          {!showForm && (
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              آدرس جدید
            </Button>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 space-y-3 rounded-2xl border border-border bg-card p-4"
          >
            <h2 className="font-semibold">
              {editingId ? "ویرایش آدرس" : "افزودن آدرس"}
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="addr-title">عنوان</Label>
                <Input
                  id="addr-title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="مثلاً خانه"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-name">نام گیرنده</Label>
                <Input
                  id="addr-name"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-phone">موبایل</Label>
                <Input
                  id="addr-phone"
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="09121234567"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-province">استان</Label>
                <Input
                  id="addr-province"
                  value={form.province}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, province: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-city">شهر</Label>
                <Input
                  id="addr-city"
                  value={form.city}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, city: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-postal">کد پستی</Label>
                <Input
                  id="addr-postal"
                  dir="ltr"
                  value={form.postalCode}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, postalCode: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="addr-line">آدرس کامل</Label>
              <Input
                id="addr-line"
                value={form.addressLine}
                onChange={(e) =>
                  setForm((f) => ({ ...f, addressLine: e.target.value }))
                }
                required
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={form.isDefault ?? false}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, isDefault: v === true }))
                }
              />
              آدرس پیش‌فرض
            </label>

            <div className="flex gap-2 pt-1">
              <Button type="submit" disabled={pending}>
                {pending ? "در حال ذخیره..." : "ذخیره"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={pending}
              >
                انصراف
              </Button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            در حال بارگذاری آدرس‌ها...
          </p>
        ) : addresses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              هنوز آدرسی ثبت نکرده‌اید.
            </p>
            {!showForm && (
              <Button className="mt-4" onClick={openCreate}>
                افزودن اولین آدرس
              </Button>
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {addresses.map((address) => (
              <li
                key={address.id}
                className={cn(
                  "rounded-2xl border border-border bg-card p-4",
                  address.isDefault && "ring-1 ring-primary/30"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{address.title}</p>
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          <Star className="h-3 w-3" />
                          پیش‌فرض
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm">{address.fullName}</p>
                    <p className="text-sm text-muted-foreground" dir="ltr">
                      {address.phone}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed">
                      {address.province}، {address.city} — {address.addressLine}
                    </p>
                    <p className="text-xs text-muted-foreground" dir="ltr">
                      کد پستی: {address.postalCode}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {!address.isDefault && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setDefault(address.id)}
                      disabled={pending}
                    >
                      پیش‌فرض کن
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(address)}
                    disabled={pending}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    ویرایش
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => askDelete(address.id)}
                    disabled={pending}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    حذف
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={(open) => {
            if (!open) {
              setConfirmOpen(false);
              setDeleteId(null);
            } else {
              setConfirmOpen(true);
            }
          }}
          title="حذف آدرس"
          description="آیا مطمئن هستید این آدرس حذف شود؟"
          confirmLabel="حذف"
          confirmVariant="destructive"
          cancelLabel="انصراف"
          loading={pending}
          onConfirm={confirmDelete}
        />
      </RequireAuth>
    </ProfileShell>
  );
}
