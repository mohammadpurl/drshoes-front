"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Search, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/product/product-image";
import { ProductQuickView } from "@/components/product/product-quick-view";
import { productImageAlt } from "@/lib/seo/site";
import { formatToman } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useCartActions } from "@/hooks/use-cart-actions";
import { useWishlistStore } from "@/store/wishlist-store";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const toggleWish = useWishlistStore((s) => s.toggle);
  const isWished = useWishlistStore((s) => s.has(product.id));
  const { addItem } = useCartActions();
  const [hovered, setHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const hoverImage = product.images[1] ?? product.images[0];
  const hasHoverImage = hoverImage !== product.images[0];
  const displayImage =
    hovered && hasHoverImage ? hoverImage : product.images[0];

  const defaultSize =
    product.sizes.find(
      (s) => !(product.unavailableSizes ?? []).includes(s)
    ) ?? product.sizes[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!defaultSize) return;
    void addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      size: defaultSize,
      image: product.images[0],
    });
  };

  const handleToggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWish(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <article
        className={cn("group flex flex-col", className)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted">
          <Link
            href={`/products/${product.slug}`}
            className="absolute inset-0 z-[1] block"
            aria-label={`مشاهده ${product.name}`}
          >
            <ProductImage
              src={displayImage}
              slug={product.slug}
              productId={product.id}
              alt={productImageAlt(product)}
              fill
              className="object-cover transition-transform duration-500 md:group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </Link>

          {(product.isNew || product.discount) && (
            <div className="pointer-events-none absolute start-2 top-2 z-10 flex flex-wrap gap-1">
              {product.isNew && (
                <Badge variant="new" className="text-[10px]">
                  جدید
                </Badge>
              )}
              {product.discount && (
                <Badge variant="discount" className="text-[10px]">
                  ٪{product.discount}
                </Badge>
              )}
            </div>
          )}

          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-3 bg-gradient-to-t from-black/45 via-black/20 to-transparent px-3 pb-3 pt-10 transition-opacity duration-200",
              "opacity-100 md:opacity-0 md:group-hover:opacity-100"
            )}
          >
            <button
              type="button"
              onClick={handleQuickView}
              className="pointer-events-auto hidden h-10 w-10 items-center justify-center rounded-full bg-white/95 text-foreground shadow-md transition hover:scale-105 hover:bg-white md:flex"
              aria-label="مشاهده سریع"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleToggleWish}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-foreground shadow-md transition hover:scale-105 hover:bg-white"
              aria-label="افزودن به علاقه‌مندی‌ها"
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  isWished && "fill-primary text-primary"
                )}
              />
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-foreground shadow-md transition hover:scale-105 hover:bg-white"
              aria-label="افزودن به سبد خرید"
            >
              <ShoppingBag className="h-5 w-5" />
            </button>
          </div>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="mt-2.5 space-y-1 text-center"
        >
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
            {product.name}
          </h3>
          <div className="flex flex-col items-center gap-0.5">
            <p className="text-base font-bold text-highlight">
              {formatToman(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">
                {formatToman(product.originalPrice)}
              </p>
            )}
          </div>
        </Link>
      </article>

      <ProductQuickView
        product={product}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
}
