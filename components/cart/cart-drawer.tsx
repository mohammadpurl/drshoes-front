"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProductImage } from "@/components/product/product-image";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartActions } from "@/hooks/use-cart-actions";
import {
  useCartStore,
  getCartSubtotal,
  getPromoDiscount,
} from "@/store/cart-store";
import { formatToman } from "@/lib/format";
import { SHIPPING_COST } from "@/lib/constants";

export function CartDrawer() {
  const router = useRouter();
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const items = useCartStore((s) => s.items);
  const isSyncing = useCartStore((s) => s.isSyncing);
  const promoCode = useCartStore((s) => s.promoCode);
  const setPromoCode = useCartStore((s) => s.setPromoCode);
  const { updateQuantity, removeItem, refreshCart } = useCartActions();

  const subtotal = getCartSubtotal(items);
  const discount = getPromoDiscount(subtotal, promoCode);
  const shipping = items.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal - discount + shipping;

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setOpen(open);
        if (open) {
          const state = useCartStore.getState();
          if (!state.isSyncing && state.items.length === 0) {
            void refreshCart();
          }
        }
      }}
    >
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b px-4 py-4 text-start">
          <SheetTitle className="flex items-center gap-2">
            سبد خرید ({items.length})
            {isSyncing && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isSyncing && items.length === 0 ? (
            <p className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              در حال بارگذاری سبد...
            </p>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              سبد خرید شما خالی است
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.lineId ?? `${item.productId}-${item.size}`}
                  className="flex gap-3 rounded-xl border border-border p-3"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <ProductImage
                      src={item.image}
                      slug={item.slug}
                      productId={item.productId}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                    <p className="font-medium leading-tight">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      سایز {item.size}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      {formatToman(item.price)}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-lg border border-border">
                        <button
                          type="button"
                          className="rounded-s-lg p-1.5 hover:bg-muted"
                          disabled={isSyncing}
                          onClick={() =>
                            void updateQuantity(item, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="rounded-e-lg p-1.5 hover:bg-muted"
                          disabled={isSyncing}
                          onClick={() =>
                            void updateQuantity(item, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={isSyncing}
                        onClick={() => void removeItem(item)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-4 border-t px-4 py-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                کد تخفیف
              </label>
              <div className="flex gap-2">
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="مثلاً DRSHOES10"
                  className="flex-1"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                DRSHOES10 (۱۰٪) · RUNNING5 (۵٪)
              </p>
            </div>

            <Separator />

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

            <Button
              className="w-full"
              size="lg"
              disabled={isSyncing}
              onClick={() => {
                setOpen(false);
                router.push("/checkout");
              }}
            >
              تکمیل خرید
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
