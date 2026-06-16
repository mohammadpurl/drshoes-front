"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { CreditCard } from "lucide-react";
import {
  getAdminPaymentSettingsAction,
  updateAdminPaymentSettingsAction,
} from "@/app/_actions/admin-order-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCardNumber } from "@/lib/payment-status";
import { notifyError, notifySuccess } from "@/lib/notify-action";
import type { PaymentInfo } from "@/types/payment.api";

export function PaymentSettingsForm() {
  const [form, setForm] = useState<PaymentInfo>({
    cardNumber: "",
    cardHolder: "",
    bankName: "",
    instructions: "",
  });
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getAdminPaymentSettingsAction();
    setLoading(false);
    if (result.success) {
      setForm(result.data);
    } else {
      notifyError(result.error);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateAdminPaymentSettingsAction(form);
      if (result.success) {
        notifySuccess("تنظیمات پرداخت ذخیره شد");
        setForm(result.data);
        return;
      }
      notifyError(result.error);
    });
  };

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <h1 className="flex items-center gap-2 text-xl font-bold">
        <CreditCard className="h-5 w-5 text-primary" />
        تنظیمات پرداخت کارت‌به‌کارت
      </h1>
      <p className="text-sm text-muted-foreground">
        این اطلاعات در صفحه checkout و جزئیات سفارش به مشتری نمایش داده می‌شود.
      </p>

      <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <div className="space-y-1.5">
          <Label htmlFor="card-number">شماره کارت</Label>
          <Input
            id="card-number"
            dir="ltr"
            value={form.cardNumber}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                cardNumber: e.target.value.replace(/\D/g, ""),
              }))
            }
            placeholder="6037991234567890"
            required
            minLength={16}
          />
          {form.cardNumber && (
            <p className="text-xs text-muted-foreground" dir="ltr">
              {formatCardNumber(form.cardNumber)}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="card-holder">نام صاحب کارت</Label>
          <Input
            id="card-holder"
            value={form.cardHolder}
            onChange={(e) =>
              setForm((f) => ({ ...f, cardHolder: e.target.value }))
            }
            placeholder="علی رضایی"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bank-name">نام بانک</Label>
          <Input
            id="bank-name"
            value={form.bankName}
            onChange={(e) =>
              setForm((f) => ({ ...f, bankName: e.target.value }))
            }
            placeholder="ملی"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="instructions">راهنمای پرداخت (اختیاری)</Label>
          <Input
            id="instructions"
            value={form.instructions}
            onChange={(e) =>
              setForm((f) => ({ ...f, instructions: e.target.value }))
            }
            placeholder="مثلاً لطفاً شماره سفارش را در توضیحات واریز بنویسید"
          />
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </Button>
    </form>
  );
}
