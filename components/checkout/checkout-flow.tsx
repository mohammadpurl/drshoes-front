"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, ShoppingBag } from "lucide-react";
import { listAddressesAction } from "@/app/_actions/address-actions";
import { checkoutAction } from "@/app/_actions/checkout-actions";
import { ProductImage } from "@/components/product/product-image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore, getCartSubtotal, getPromoDiscount } from "@/store/cart-store";
import { formatToman } from "@/lib/format";
import { SHIPPING_COST } from "@/lib/constants";
import { notifyError } from "@/lib/notify-action";
import type { AddressRead } from "@/types/address.api";
import { cn } from "@/lib/utils";

export function CheckoutFlow() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const cartToken = useCartStore((s) => s.cartToken);
  const promoCode = useCartStore((s) => s.promoCode);

  const [addresses, setAddresses] = useState<AddressRead[]>([]);
  const [addressId, setAddressId] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [pending, startTransition] = useTransition();

  const subtotal = getCartSubtotal(items);
  const discount = getPromoDiscount(subtotal, promoCode);
  const shipping = items.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal - discount + shipping;

  const loadAddresses = useCallback(async () => {
    setLoadingAddresses(true);
    const result = await listAddressesAction();
    setLoadingAddresses(false);
    if (result.success) {
      setAddresses(result.data);
      const defaultAddr =
        result.data.find((a) => a.isDefault) ?? result.data[0];
      if (defaultAddr) setAddressId(defaultAddr.id);
      return;
    }
    notifyError(result.error);
  }, []);

  useEffect(() => {
    void loadAddresses();
  }, [loadAddresses]);

  const handleSubmit = () => {
    if (!addressId) {
      notifyError("لطفاً یک آدرس انتخاب کنید");
      return;
    }

    if (items.length === 0) {
      notifyError("سبد خرید خالی است");
      return;
    }

    startTransition(async () => {
      const result = await checkoutAction(
        {
          addressId,
          notes: notes.trim() || undefined,
        },
        cartToken ?? undefined
      );

      if (!result.success) {
        notifyError(result.error);
        return;
      }

      router.push(
        `/checkout/payment?orderId=${encodeURIComponent(result.data.id)}`
      );
    });
  };

  return (
      <div className="space-y-6">
        <section dir="rtl" className="rounded-2xl border border-border bg-card p-4">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <MapPin className="h-5 w-5 text-primary" />
            آدرس ارسال
          </h2>

          {loadingAddresses ? (
            <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
          ) : addresses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm">
              <p className="text-muted-foreground">
                هنوز آدرسی ثبت نکرده‌اید.
              </p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link href="/profile/addresses?redirect=/checkout">
                  افزودن آدرس
                </Link>
              </Button>
            </div>
          ) : (
            <RadioGroup
              dir="rtl"
              value={addressId}
              onValueChange={setAddressId}
              className="block"
            >
              <ul className="space-y-2">
                {addresses.map((address) => (
                  <li key={address.id}>
                    <label
                      dir="rtl"
                      className={cn(
                        "grid w-full cursor-pointer grid-cols-[auto_1fr] items-start gap-3 rounded-xl border p-3 transition",
                        addressId === address.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <RadioGroupItem
                        value={address.id}
                        className="mt-0.5 shrink-0"
                      />
                      <div className="min-w-0 space-y-0.5 text-start text-sm">
                        <p className="font-medium">{address.title}</p>
                        <p>{address.fullName}</p>
                        <p className="text-end text-muted-foreground" dir="ltr">
                          {address.phone}
                        </p>
                        <p className="mt-1 leading-relaxed text-muted-foreground">
                          {address.province}، {address.city} —{" "}
                          {address.addressLine}
                        </p>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </RadioGroup>
          )}

          {addresses.length > 0 && (
            <Button variant="ghost" size="sm" className="mt-2 px-0" asChild>
              <Link href="/profile/addresses">مدیریت آدرس‌ها</Link>
            </Button>
          )}
        </section>

        <section dir="rtl" className="rounded-2xl border border-border bg-card p-4">
          <Label htmlFor="checkout-notes" className="font-semibold">
            یادداشت سفارش (اختیاری)
          </Label>
          <Textarea
            id="checkout-notes"
            dir="rtl"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="مثلاً زمان مناسب تحویل..."
            className="mt-2 min-h-[80px] text-start"
          />
        </section>

        <section dir="rtl" className="rounded-2xl border border-border bg-card p-4">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <ShoppingBag className="h-5 w-5 text-primary" />
            خلاصه سفارش
          </h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.lineId ?? `${item.productId}-${item.size}`}
                className="flex gap-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <ProductImage
                    src={item.image}
                    slug={item.slug}
                    productId={item.productId}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1 text-start">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    سایز {item.size} · {item.quantity} عدد
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    {formatToman(item.price * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">جمع جزء</span>
              <span>{formatToman(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>تخفیف</span>
                <span>-{formatToman(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">ارسال</span>
              <span>{formatToman(shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>مبلغ قابل پرداخت</span>
              <span className="text-primary">{formatToman(total)}</span>
            </div>
          </div>
        </section>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          پرداخت آنلاین فعال نیست. پس از ثبت سفارش، شماره کارت نمایش داده می‌شود
          و باید رسید واریز را آپلود کنید.
        </div>

        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            className="w-full"
            disabled={pending || !addressId || addresses.length === 0}
            onClick={handleSubmit}
          >
            {pending ? "در حال ثبت..." : "ثبت سفارش و ادامه پرداخت"}
          </Button>
          <Button variant="outline" size="lg" className="w-full" asChild>
            <Link href="/">ادامه خرید</Link>
          </Button>
        </div>
      </div>
  );
}
