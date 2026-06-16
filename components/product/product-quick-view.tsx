"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/product/product-image";
import { BrandLogo } from "@/components/brand/brand-logo";
import { productImageAlt } from "@/lib/seo/site";
import { formatToman } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCartActions } from "@/hooks/use-cart-actions";
import { useWishlistStore } from "@/store/wishlist-store";

interface ProductQuickViewProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductQuickView({
  product,
  open,
  onOpenChange,
}: ProductQuickViewProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(
    product.sizes.find(
      (s) => !(product.unavailableSizes ?? []).includes(s)
    ) ?? product.sizes[0]
  );
  const { addItem } = useCartActions();
  const toggleWish = useWishlistStore((s) => s.toggle);
  const isWished = useWishlistStore((s) => s.has(product.id));

  const unavailable = new Set(product.unavailableSizes ?? []);

  const handleAddToCart = () => {
    if (!size) return;
    void addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      size,
      image: product.images[0],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-muted sm:min-h-[420px] lg:min-h-[480px]">
              <ProductImage
                src={product.images[activeImage] ?? product.images[0]}
                slug={product.slug}
                productId={product.id}
                alt={productImageAlt(product)}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 45vw"
                priority
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex justify-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 sm:h-24 sm:w-24",
                      activeImage === i ? "border-primary" : "border-border"
                    )}
                  >
                    <ProductImage
                      src={img}
                      slug={product.slug}
                      productId={product.id}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </button>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              size="lg"
              className="w-full border-2 text-base font-semibold"
              asChild
            >
              <Link
                href={`/products/${product.slug}`}
                onClick={() => onOpenChange(false)}
              >
                جزئیات
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-5 lg:py-2">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <BrandLogo brand={product.brand} size={22} />
                {product.brand}
              </div>
              <h2 className="text-2xl font-bold leading-snug sm:text-3xl">
                {product.name}
              </h2>
            </div>

            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold text-highlight">
                {formatToman(product.price)}
              </p>
              {product.originalPrice && (
                <p className="text-base text-muted-foreground line-through">
                  {formatToman(product.originalPrice)}
                </p>
              )}
            </div>

            {product.description && (
              <p className="line-clamp-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {product.description}
              </p>
            )}

            {product.sizes.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">سایز</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const isUnavailable = unavailable.has(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={isUnavailable}
                        onClick={() => setSize(s)}
                        className={cn(
                          "min-w-11 rounded-lg border px-3.5 py-2 text-sm",
                          size === s
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border",
                          isUnavailable && "opacity-40 line-through"
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                variant="highlight"
                size="lg"
                className="min-h-12 flex-1 text-base"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-5 w-5" />
                افزودن به سبد خرید
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={() => toggleWish(product.id)}
                aria-label="علاقه‌مندی"
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isWished && "fill-primary text-primary"
                  )}
                />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
