"use client";

import { motion } from "framer-motion";
import { BRANDS } from "@/lib/constants";
import type { Brand } from "@/lib/types";
import { ResponsiveCarouselSection } from "@/components/ui/responsive-carousel-section";
import { cn } from "@/lib/utils";

interface BrandScrollProps {
  selected?: Brand[];
  onToggle: (brand: Brand) => void;
}

export function BrandScroll({ selected = [], onToggle }: BrandScrollProps) {
  return (
    <ResponsiveCarouselSection
      desktop="grid"
      gridClassName="lg:grid-cols-4 xl:grid-cols-8"
      slideBasis="basis-[46%] sm:basis-[32%]"
    >
      {BRANDS.map((brand, i) => (
        <motion.button
          key={brand}
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          onClick={() => onToggle(brand)}
          className={cn(
            "w-full rounded-xl border px-3 py-2.5 text-xs font-semibold transition sm:px-4 sm:text-sm lg:text-center",
            selected.includes(brand)
              ? "border-primary bg-primary text-white"
              : "border-border bg-card hover:border-primary/50"
          )}
        >
          {brand}
        </motion.button>
      ))}
    </ResponsiveCarouselSection>
  );
}
