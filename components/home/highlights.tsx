"use client";

import { motion } from "framer-motion";
import { HIGHLIGHTS } from "@/lib/constants";
import { ResponsiveCarouselSection } from "@/components/ui/responsive-carousel-section";

interface HighlightsProps {
  onSelect: (filter: string) => void;
}

export function Highlights({ onSelect }: HighlightsProps) {
  return (
    <ResponsiveCarouselSection
      desktop="grid"
      gridClassName="lg:grid-cols-6"
      slideBasis="basis-[26%] sm:basis-[20%]"
      groupSize={1}
    >
      {HIGHLIGHTS.map((h, i) => (
        <motion.button
          key={h.id}
          type="button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onSelect(h.filter)}
          className="flex w-full flex-col items-center gap-1.5"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary via-accent to-highlight p-[2px] sm:h-16 sm:w-16">
            <span
              className={
                h.image
                  ? "relative h-full w-full overflow-hidden rounded-full bg-cover bg-center"
                  : "flex h-full w-full items-center justify-center rounded-full bg-background text-xl sm:text-2xl"
              }
              style={
                h.image ? { backgroundImage: `url(${h.image})` } : undefined
              }
            >
              {h.image ? (
                <span
                  className="absolute inset-0 rounded-full bg-black/15"
                  aria-hidden
                />
              ) : (
                h.emoji
              )}
            </span>
          </span>
          <span className="text-center text-[11px] font-medium leading-tight sm:text-xs">
            {h.label}
          </span>
        </motion.button>
      ))}
    </ResponsiveCarouselSection>
  );
}
