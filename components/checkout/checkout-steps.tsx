"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { CreditCard, Upload } from "lucide-react";
import { listAddressesAction } from "@/app/_actions/address-actions";
import {
  checkoutAction,
  getPaymentInfoAction,
  uploadReceiptAction,
} from "@/app/_actions/order-actions";
import { useSessionStore } from "@/app/_store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCardNumber } from "@/lib/payment-status";
import { formatToman } from "@/lib/format";
import { notifyError, notifySuccess } from "@/lib/notify-action";
import type { AddressRead } from "@/types/address.api";
import type { OrderRead } from "@/types/order.api";
import type { PaymentInfo } from "@/types/payment.api";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

type CheckoutPaymentProps = {
  order: OrderRead;
  onUploaded: (order: OrderRead) => void;
};

export function CheckoutPaymentStep({ order, onUploaded }: CheckoutPaymentProps) {
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    void getPaymentInfoAction().then((r) => {
      if (r.success) setPaymentInfo(r.data);
    });
  }, []);

  const handleUpload = () => {
    if (!file) {
      notifyError("لطفاً تصویر رسید را انتخاب کنید");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    if (note.trim()) formData.append("note", note.trim());

    startTransition(async () => {
      const result = await uploadReceiptAction(order.id, formData);
      if (result.success) {
        notifySuccess("رسید با موفقیت ارسال شد");
        onUploaded(result.data);
        router.push(`/profile/orders/${order.id}`);
        return;
      }
      notifyError(result.error);
    });
  };

  return (
    <section className="mt-6 space-y-4 rounded-2xl border border-primary/30 bg-primary/5 p-4">
      <h2 className="flex items-center gap-2 font-semibold text-primary">
        <CreditCard className="h-5 w-5" />
        پرداخت کارت‌به‌کارت
      </h2>
      <p className="text-sm text-muted-foreground">
        مبلغ{" "}
        <span className="font-bold text-foreground">
          {formatToman(order.total)}
        </span>{" "}
        را به شماره کارت زیر واریز کنید و رسید را آپلود نمایید.
      </p>

      {paymentInfo?.cardNumber ? (
        <div className="rounded-xl border border-border bg-card p-4 text-sm">
          {paymentInfo.bankName && (
            <p>
              <span className="text-muted-foreground">بانک: </span>
              {paymentInfo.bankName}
            </p>
          )}
          {paymentInfo.cardHolder && (
            <p className="mt-1">
              <span className="text-muted-foreground">به نام: </span>
              {paymentInfo.cardHolder}
            </p>
          )}
          <p className="mt-2 font-mono text-base font-bold tracking-wide" dir="ltr">
            {formatCardNumber(paymentInfo.cardNumber)}
          </p>
          {paymentInfo.instructions && (
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {paymentInfo.instructions}
            </p>
          )}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 p-3 text-sm text-amber-800 dark:text-amber-300">
          شماره کارت هنوز توسط فروشگاه تنظیم نشده است. پس از واریز با پشتیبانی
          تماس بگیرید.
        </p>
      )}

      <Separator />

      <div className="space-y-3">
        <Label htmlFor="receipt-file">آپلود رسید (تصویر یا PDF)</Label>
        <Input
          id="receipt-file"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <Input
          placeholder="توضیح اختیاری (مثلاً ساعت واریز)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button className="w-full" onClick={handleUpload} disabled={pending}>
          <Upload className="h-4 w-4" />
          {pending ? "در حال ارسال..." : "ارسال رسید پرداخت"}
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/profile/orders/${order.id}`}>
            بعداً رسید را آپلود می‌کنم
          </Link>
        </Button>
      </div>
    </section>
  );
}

type AddressCheckoutProps = {
  onOrderPlaced: (order: OrderRead) => void;
};

export function CheckoutAddressStep({ onOrderPlaced }: AddressCheckoutProps) {
  const cartToken = useCartStore((s) => s.cartToken);
  const [addresses, setAddresses] = useState<AddressRead[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listAddressesAction();
    setLoading(false);
    if (result.success) {
      setAddresses(result.data);
      const def = result.data.find((a) => a.isDefault) ?? result.data[0];
      if (def) setSelectedId(def.id);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = () => {
    if (!selectedId) {
      notifyError("لطفاً یک آدرس انتخاب کنید");
      return;
    }
    startTransition(async () => {
      const result = await checkoutAction(
        {
          addressId: selectedId,
          notes: notes.trim() || undefined,
        },
        cartToken ?? undefined
      );
      if (result.success) {
        notifySuccess("سفارش ثبت شد");
        onOrderPlaced(result.data);
        return;
      }
      notifyError(result.error);
    });
  };

  if (loading) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        در حال بارگذاری آدرس‌ها...
      </p>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">
          برای ثبت سفارش ابتدا یک آدرس اضافه کنید.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/profile/addresses?redirect=/checkout">
            افزودن آدرس
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <section dir="rtl" className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-4">
      <h2 className="font-semibold">انتخاب آدرس</h2>
      <ul className="space-y-2">
        {addresses.map((address) => (
          <li key={address.id}>
            <button
              type="button"
              dir="rtl"
              onClick={() => setSelectedId(address.id)}
              className={cn(
                "w-full rounded-xl border p-3 text-start text-sm transition",
                selectedId === address.id
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-border hover:bg-muted/40"
              )}
            >
              <p className="font-medium">{address.title}</p>
              <p className="text-muted-foreground">{address.fullName}</p>
              <p className="text-end text-muted-foreground" dir="ltr">
                {address.phone}
              </p>
              <p className="mt-1 text-muted-foreground">
                {address.province}، {address.city} — {address.addressLine}
              </p>
            </button>
          </li>
        ))}
      </ul>
      <div className="space-y-1.5">
        <Label htmlFor="order-notes">یادداشت سفارش (اختیاری)</Label>
        <Input
          id="order-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="مثلاً زنگ واحد ۳"
        />
      </div>
      <Button className="w-full" size="lg" onClick={handleSubmit} disabled={pending}>
        {pending ? "در حال ثبت..." : "ثبت سفارش و ادامه به پرداخت"}
      </Button>
    </section>
  );
}

export function CheckoutAuthGate({ children }: { children: React.ReactNode }) {
  const status = useSessionStore((s) => s.status);
  const updateSession = useSessionStore((s) => s.updateSession);

  useEffect(() => {
    void updateSession();
  }, [updateSession]);

  if (status === "loading") {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        در حال بررسی حساب...
      </p>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-sm">
        <p className="font-medium text-foreground">ورود الزامی است</p>
        <p className="mt-1 text-muted-foreground">
          برای ثبت سفارش وارد حساب کاربری شوید.
        </p>
        <Button variant="outline" size="sm" className="mt-3" asChild>
          <Link href="/login?redirect=/checkout">ورود / ثبت‌نام</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
