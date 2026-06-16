"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, CreditCard, Upload, CheckCircle2 } from "lucide-react";
import {
  getPaymentSettingsAction,
  uploadPaymentReceiptAction,
} from "@/app/_actions/checkout-actions";
import { Button } from "@/components/ui/button";
import { formatToman } from "@/lib/format";
import {
  formatCardNumber,
  paymentStatusClass,
  paymentStatusLabel,
} from "@/lib/payment-status";
import { validateReceiptFile } from "@/lib/receipt-upload";
import { notifyError, notifySuccess } from "@/lib/notify-action";
import type { OrderRead } from "@/types/order.api";
import type { PaymentSettingsRead } from "@/types/payment.api";
import { Badge } from "@/components/ui/badge";

type PaymentPanelProps = {
  order: OrderRead;
  settings: PaymentSettingsRead;
  onUploaded?: (order: OrderRead) => void;
  redirectOnSuccess?: boolean;
};

export function PaymentPanel({
  order,
  settings,
  onUploaded,
  redirectOnSuccess = true,
}: PaymentPanelProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pending, startTransition] = useTransition();

  const canUpload =
    !order.receiptUrl &&
    (order.paymentStatus === "awaiting_receipt" ||
      order.paymentStatus === "rejected" ||
      !order.paymentStatus);

  const copyCard = async () => {
    const digits = settings.cardNumber.replace(/\D/g, "");
    try {
      await navigator.clipboard.writeText(digits);
      notifySuccess("شماره کارت کپی شد");
    } catch {
      notifyError("کپی ناموفق بود");
    }
  };

  const handleUpload = () => {
    if (!file) {
      notifyError("لطفاً تصویر رسید را انتخاب کنید");
      return;
    }
    const validationError = validateReceiptFile(file);
    if (validationError) {
      notifyError(validationError);
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadPaymentReceiptAction(order.id, formData);
      if (!result.success) {
        notifyError(result.error);
        return;
      }
      notifySuccess("رسید با موفقیت ارسال شد");
      onUploaded?.(result.data);
      if (redirectOnSuccess) {
        router.push(`/checkout/success?orderId=${encodeURIComponent(order.id)}`);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <CreditCard className="h-5 w-5 text-primary" />
              پرداخت کارت‌به‌کارت
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              مبلغ قابل واریز:{" "}
              <span className="font-bold text-primary">
                {formatToman(order.total)}
              </span>
            </p>
          </div>
          <Badge
            variant="outline"
            className={paymentStatusClass(order.paymentStatus)}
          >
            {paymentStatusLabel(order.paymentStatus)}
          </Badge>
        </div>
      </div>

      <section className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
        <p className="text-sm font-medium">شماره کارت مقصد</p>
        <p
          className="mt-2 text-2xl font-bold tracking-widest"
          dir="ltr"
        >
          {formatCardNumber(settings.cardNumber)}
        </p>
        {settings.cardHolderName && (
          <p className="mt-2 text-sm">
            به نام: <span className="font-medium">{settings.cardHolderName}</span>
          </p>
        )}
        {settings.bankName && (
          <p className="text-sm text-muted-foreground">
            بانک: {settings.bankName}
          </p>
        )}
        {settings.iban && (
          <p className="mt-1 text-xs text-muted-foreground" dir="ltr">
            شبا: {settings.iban}
          </p>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={copyCard}
        >
          <Copy className="h-4 w-4" />
          کپی شماره کارت
        </Button>
        {settings.instructions && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {settings.instructions}
          </p>
        )}
      </section>

      {order.receiptUrl ? (
        <section className="rounded-2xl border border-border bg-card p-4">
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            رسید ارسال شده
          </h3>
          <div className="relative mx-auto aspect-[3/4] max-w-xs overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={order.receiptUrl}
              alt="رسید پرداخت"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            پس از بررسی ادمین، وضعیت پرداخت به‌روز می‌شود.
          </p>
          <Button variant="outline" className="mt-4 w-full" asChild>
            <Link href={`/profile/orders/${order.id}`}>مشاهده سفارش</Link>
          </Button>
        </section>
      ) : canUpload ? (
        <section className="rounded-2xl border border-border bg-card p-4">
          <h3 className="mb-3 font-semibold">آپلود رسید واریز</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            پس از واریز، تصویر یا PDF رسید را بارگذاری کنید.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            {file ? file.name : "انتخاب فایل رسید"}
          </Button>
          <Button
            className="mt-3 w-full"
            disabled={!file || pending}
            onClick={handleUpload}
          >
            {pending ? "در حال ارسال..." : "ارسال رسید"}
          </Button>
        </section>
      ) : (
        <section className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
          وضعیت پرداخت این سفارش قابل تغییر نیست.
        </section>
      )}
    </div>
  );
}
