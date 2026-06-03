"use client";

import { CATEGORIES } from "@/lib/constants";
import { ResponsiveCarouselSection } from "@/components/ui/responsive-carousel-section";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  active: string;
  onChange: (id: string) => void;
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <ResponsiveCarouselSection
      desktop="wrap"
      slideBasis="basis-[42%] sm:basis-[30%]"
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={cn(
            "w-full shrink-0 rounded-full px-4 py-2 text-xs font-medium transition sm:text-sm lg:w-auto",
            active === cat.id
              ? "bg-primary text-white shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {cat.label}
        </button>
      ))}
    </ResponsiveCarouselSection>
  );
}
