"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Heart, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { getRelatedProducts, getReviewsForProduct } from "@/data/products";
import { FOOT_TYPE_LABELS, SURFACE_LABELS } from "@/lib/constants";
import { formatToman } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "./product-gallery";
import { ProductCard } from "./product-card";
import { getCardAspectVariant } from "@/lib/card-layout";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const [size, setSize] = useState(product.sizes[0]);
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const isWished = useWishlistStore((s) => s.has(product.id));

  const related = getRelatedProducts(product);
  const productReviews = getReviewsForProduct(product.id);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      size,
      image: product.images[0],
    });
  };

  const handleBuyNow = () => {
    handleAdd();
    setCartOpen(true);
  };

  return (
    <div className="page-container pb-24 pt-4 md:pb-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              {product.rating && (
                <div className="mt-1 flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-highlight text-highlight" />
                  <span>{product.rating}</span>
                  <span className="text-muted-foreground">
                    ({product.reviewCount} نظر)
                  </span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => toggleWish(product.id)}
              className="rounded-full border p-2"
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  isWished && "fill-primary text-primary"
                )}
              />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.isNew && <Badge variant="new">جدید</Badge>}
            {product.isBestseller && (
              <Badge variant="bestseller">پرفروش</Badge>
            )}
            {product.discount && (
              <Badge variant="discount">٪{product.discount} تخفیف</Badge>
            )}
          </div>

          <div>
            <p className="text-3xl font-bold text-primary">
              {formatToman(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-muted-foreground line-through">
                {formatToman(product.originalPrice)}
              </p>
            )}
          </div>

          <div>
            <h3 className="mb-2 font-semibold">انتخاب سایز</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const unavailable = product.unavailableSizes?.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={unavailable}
                    onClick={() => setSize(s)}
                    className={cn(
                      "min-w-[3rem] rounded-xl border px-4 py-2 text-sm font-medium transition",
                      size === s
                        ? "border-primary bg-primary text-white"
                        : "border-border hover:border-primary",
                      unavailable && "opacity-40 line-through"
                    )}
                  >
                    {s}
                    {unavailable && (
                      <span className="block text-[10px]">ناموجود</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <h3 className="mb-2 font-semibold">سازگاری با قوس پا</h3>
            <div className="flex flex-wrap gap-2">
              {product.footType.map((ft) => (
                <span
                  key={ft}
                  className="inline-flex items-center gap-1 rounded-lg bg-background px-3 py-1 text-sm border"
                >
                  {FOOT_TYPE_LABELS[ft].emoji}
                  {FOOT_TYPE_LABELS[ft].label}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              برای انتخاب دقیق‌تر، نوع برخورد پا با زمین هنگام دویدن را در نظر
              بگیرید.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "دراپ", value: `${product.drop} میلی‌متر` },
              { label: "وزن", value: `${product.weight} گرم` },
              {
                label: "استک",
                value: `${product.stackHeight ?? "—"} میلی‌متر`,
              },
              {
                label: "سطح",
                value: product.surface
                  .map((s) => SURFACE_LABELS[s])
                  .join(" · "),
              },
            ].map((spec) => (
              <div
                key={spec.label}
                className="rounded-xl border border-border p-3 text-center"
              >
                <p className="text-xs text-muted-foreground">{spec.label}</p>
                <p className="mt-1 text-sm font-semibold">{spec.value}</p>
              </div>
            ))}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="flex gap-3">
            <Button className="flex-1" size="lg" onClick={handleAdd}>
              افزودن به سبد
            </Button>
            <Button
              variant="accent"
              className="flex-1"
              size="lg"
              onClick={handleBuyNow}
            >
              خرید فوری
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-10" />

      <section>
        <h2 className="mb-4 text-xl font-bold">نظرات مشتریان</h2>
        {productReviews.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            هنوز نظری ثبت نشده است.
          </p>
        ) : (
          <ul className="space-y-4">
            {productReviews.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{r.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.date}
                  </span>
                </div>
                <div className="my-1 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < r.rating
                          ? "fill-highlight text-highlight"
                          : "text-muted"
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Separator className="my-10" />

      <section>
        <h2 className="mb-4 text-xl font-bold">محصولات مرتبط</h2>
        <div className="product-masonry columns-1 sm:columns-2 lg:columns-3">
          {related.map((p, index) => (
            <div key={p.id} className="mb-5 break-inside-avoid sm:mb-6">
              <ProductCard
                product={p}
                aspectVariant={getCardAspectVariant(index)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
