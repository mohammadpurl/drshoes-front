"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BRAND_GRADIENTS } from "@/lib/constants";
import type { Brand } from "@/lib/types";

interface ProductGalleryProps {
  images: string[];
  name: string;
  brand: Brand;
}

export function ProductGallery({ images, name, brand }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br cursor-zoom-in",
          BRAND_GRADIENTS[brand]
        )}
        onClick={() => setZoomed(!zoomed)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "relative h-full w-full",
              zoomed && "scale-150 transition-transform duration-300"
            )}
          >
            <Image
              src={images[active]}
              alt={name}
              fill
              className="object-contain p-6"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
        <p className="absolute bottom-3 start-3 rounded-lg bg-black/40 px-2 py-1 text-xs text-white">
          {zoomed ? "کلیک برای کوچک‌کردن" : "کلیک برای بزرگ‌نمایی"}
        </p>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2",
              active === i ? "border-primary" : "border-transparent"
            )}
          >
            <Image src={img} alt="" fill className="object-cover" sizes="64px" />
          </button>
        ))}
      </div>
    </div>
  );
}
