"use client";

import { useEffect, useState, useTransition } from "react";
import { Truck } from "lucide-react";
import { updateAdminOrderFulfillmentAction } from "@/app/_actions/admin-order-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SHIPPING_METHOD_OPTIONS } from "@/lib/order-fulfillment";
import { notifyError, notifySuccess } from "@/lib/notify-action";
import type { AdminOrderRead } from "@/types/order.api";

const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "در انتظار پرداخت" },
  { value: "confirmed", label: "تأیید شده" },
  { value: "preparing", label: "در حال آماده‌سازی" },
  { value: "shipped", label: "ارسال شده" },
  { value: "delivered", label: "تحویل شده" },
  { value: "cancelled", label: "لغو شده" },
] as const;

type AdminOrderFulfillmentFormProps = {
  order: AdminOrderRead;
  onUpdated: (order: AdminOrderRead) => void;
};

export function AdminOrderFulfillmentForm({
  order,
  onUpdated,
}: AdminOrderFulfillmentFormProps) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(order.status);
  const [shippingMethod, setShippingMethod] = useState(order.shippingMethod ?? "");
  const [customMethod, setCustomMethod] = useState("");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");
  const [shippingNote, setShippingNote] = useState(order.shippingNote ?? "");

  useEffect(() => {
    setStatus(order.status);
    setShippingMethod(order.shippingMethod ?? "");
    setCustomMethod(
      order.shippingMethod &&
        !SHIPPING_METHOD_OPTIONS.includes(
          order.shippingMethod as (typeof SHIPPING_METHOD_OPTIONS)[number]
        )
        ? order.shippingMethod
        : ""
    );
    setTrackingNumber(order.trackingNumber ?? "");
    setShippingNote(order.shippingNote ?? "");
  }, [order]);

  const resolvedMethod =
    shippingMethod === "custom" ? customMethod.trim() : shippingMethod.trim();

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateAdminOrderFulfillmentAction(order.id, {
        status,
        shippingMethod: resolvedMethod || null,
        trackingNumber: trackingNumber.trim() || null,
        shippingNote: shippingNote.trim() || null,
      });
      if (result.success) {
        notifySuccess("اطلاعات ارسال ذخیره شد");
        onUpdated(result.data);
      } else {
        notifyError(result.error);
      }
    });
  };

  const methodSelectValue =
    shippingMethod === "custom" ||
    (shippingMethod &&
      !SHIPPING_METHOD_OPTIONS.includes(
        shippingMethod as (typeof SHIPPING_METHOD_OPTIONS)[number]
      ))
      ? "custom"
      : shippingMethod;

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <h2 className="mb-3 flex items-center gap-2 font-semibold">
        <Truck className="h-4 w-4 text-primary" />
        مدیریت ارسال
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        وضعیت سفارش و جزئیات روش ارسال را برای مشتری مشخص کنید.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="order-status">وضعیت سفارش</Label>
          <select
            id="order-status"
            className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {ORDER_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shipping-method">روش ارسال</Label>
          <select
            id="shipping-method"
            className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
            value={methodSelectValue}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "custom") {
                setShippingMethod("custom");
                return;
              }
              setShippingMethod(value);
              setCustomMethod("");
            }}
          >
            <option value="">انتخاب کنید</option>
            {SHIPPING_METHOD_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value="custom">سایر</option>
          </select>
        </div>

        {methodSelectValue === "custom" ? (
          <div className="space-y-2">
            <Label htmlFor="custom-method">نام روش ارسال</Label>
            <Input
              id="custom-method"
              value={customMethod}
              onChange={(e) => setCustomMethod(e.target.value)}
              placeholder="مثلاً باربری"
            />
          </div>
        ) : (
          <div className="hidden sm:block" />
        )}

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="tracking-number">کد رهگیری</Label>
          <Input
            id="tracking-number"
            dir="ltr"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="1234567890"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="shipping-note">توضیحات ارسال</Label>
          <textarea
            id="shipping-note"
            className="min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            value={shippingNote}
            onChange={(e) => setShippingNote(e.target.value)}
            placeholder="مثلاً زمان تحویل تقریبی یا نکات مهم برای مشتری"
          />
        </div>
      </div>

      <Button className="mt-4" size="sm" disabled={pending} onClick={handleSave}>
        {pending ? "در حال ذخیره..." : "ذخیره اطلاعات ارسال"}
      </Button>
    </section>
  );
}
