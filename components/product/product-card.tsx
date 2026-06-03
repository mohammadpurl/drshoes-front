"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatToman } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useWishlistStore } from "@/store/wishlist-store";
import {
  CARD_ASPECT_CLASSES,
  type CardAspectVariant,
} from "@/lib/card-layout";

const IMAGE_MOTION = {
  duration: 0.45,
  ease: [0.4, 0, 0.2, 1] as const,
};

interface ProductCardProps {
  product: Product;
  aspectVariant?: CardAspectVariant;
  className?: string;
}

export function ProductCard({
  product,
  aspectVariant = "standard",
  className,
}: ProductCardProps) {
  const toggleWish = useWishlistStore((s) => s.toggle);
  const isWished = useWishlistStore((s) => s.has(product.id));
  const [hovered, setHovered] = useState(false);
  const hoverImage = product.images[1] ?? product.images[0];
  const hasHoverImage = hoverImage !== product.images[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("group", className)}
    >
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col"
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl [perspective:900px]",
            CARD_ASPECT_CLASSES[aspectVariant]
          )}
          onMouseEnter={() => hasHoverImage && setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {(product.isNew || product.discount) && (
            <div className="absolute start-3 top-3 z-10 flex flex-wrap gap-1">
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

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWish(product.id);
            }}
            className="absolute end-3 top-3 z-10 rounded-full bg-white/90 p-2.5 opacity-0 shadow-sm transition-all group-hover:opacity-100 dark:bg-black/60 sm:opacity-100"
            aria-label="علاقه‌مندی"
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isWished && "fill-primary text-primary"
              )}
            />
          </button>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={hovered && hasHoverImage ? hoverImage : product.images[0]}
              className="absolute inset-0 will-change-transform"
              initial={{ opacity: 0, scale: 0.88, x: 36, rotateY: -14 }}
              animate={{ opacity: 1, scale: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.88, x: -36, rotateY: 14 }}
              transition={IMAGE_MOTION}
            >
              <Image
                src={hovered && hasHoverImage ? hoverImage : product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-5"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {hasHoverImage && hovered && (
              <motion.span
                className="pointer-events-none absolute inset-x-0 bottom-3 z-[1] mx-auto w-fit rounded-full bg-black/55 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.28, delay: 0.1 }}
              >
                نمای دیگر
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-3 space-y-1 px-1 text-center">
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <h3 className="text-sm font-medium leading-snug text-foreground sm:text-base">
            {product.name}
          </h3>
          <div className="flex flex-col items-center gap-0.5">
            <p className="text-base font-bold text-primary sm:text-lg">
              {formatToman(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">
                {formatToman(product.originalPrice)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
