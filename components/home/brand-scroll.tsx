"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import type { Brand } from "@/lib/types";
import { cn } from "@/lib/utils";

const STRIP_BRANDS: Brand[] = [
  "Nike",
  "Adidas",
  "ASICS",
  "Hoka",
  "Saucony",
  "New Balance",
  "On Running",
  "Brooks",
];

interface BrandScrollProps {
  selected?: Brand[];
  onToggle: (brand: Brand) => void;
}

export function BrandScroll({ selected = [], onToggle }: BrandScrollProps) {
  return (
    <section
      aria-label="فیلتر برند"
      className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] shadow-md sm:rounded-3xl"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_120%_at_20%_0%,rgba(255,214,0,0.12),transparent_55%),radial-gradient(ellipse_60%_80%_at_85%_100%,rgba(255,59,92,0.08),transparent_50%)]"
        aria-hidden
      />

      <div className="relative flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-5 sm:py-3.5 lg:px-6">
        <div className="scrollbar-hide flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto sm:gap-0">
          {STRIP_BRANDS.map((brand, i) => {
            const isSelected = selected.includes(brand);
            return (
              <div key={brand} className="flex shrink-0 items-center">
                {i > 0 && (
                  <span
                    className="mx-2 hidden h-7 w-px shrink-0 bg-gradient-to-b from-transparent via-highlight/50 to-transparent sm:mx-3 sm:block md:mx-4 md:h-8"
                    aria-hidden
                  />
                )}
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => onToggle(brand)}
                  aria-pressed={isSelected}
                  aria-label={`فیلتر برند ${brand}`}
                  className={cn(
                    "flex items-center justify-center rounded-lg px-2 py-2 transition sm:px-3",
                    isSelected
                      ? "bg-primary/20 ring-1 ring-primary/60"
                      : "opacity-90 hover:bg-white/5 hover:opacity-100"
                  )}
                >
                  <BrandLogo brand={brand} size={32} strip inverted />
                </motion.button>
              </div>
            );
          })}
        </div>

        <span
          className="hidden h-10 w-px shrink-0 bg-gradient-to-b from-transparent via-highlight/45 to-transparent sm:block"
          aria-hidden
        />

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 pt-3 sm:justify-end sm:border-t-0 sm:pt-0 sm:ps-1">
          <div className="flex flex-col gap-1.5 text-start">
            <p className="text-xs font-semibold text-white sm:text-sm">
              اصالت را با ما تجربه کنید
            </p>
            <span className="inline-flex w-fit rounded-full bg-gradient-to-l from-highlight to-accent px-3 py-0.5 text-[10px] font-bold text-black sm:text-[11px]">
              ۱۰۰٪ اورجینال
            </span>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-highlight/35 bg-highlight/10 sm:h-12 sm:w-12">
            <ShieldCheck
              className="h-5 w-5 text-highlight sm:h-6 sm:w-6"
              strokeWidth={2}
            />
          </span>
        </div>
      </div>
    </section>
  );
}
