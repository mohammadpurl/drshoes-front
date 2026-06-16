"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { FOOT_TYPE_LABELS, SURFACE_LABELS } from "@/lib/constants";
import { formatToman } from "@/lib/format";
import type { Brand, ProductFilters } from "@/lib/types";

interface ActiveFilterChipsProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  onClear: () => void;
}

export function ActiveFilterChips({
  filters,
  onChange,
  onClear,
}: ActiveFilterChipsProps) {
  const chips: { key: string; label: ReactNode; remove: () => void }[] = [];

  filters.brands?.forEach((b) =>
    chips.push({
      key: `brand-${b}`,
      label: (
        <span className="inline-flex items-center gap-1.5">
          <BrandLogo brand={b as Brand} size={14} />
          {b}
        </span>
      ),
      remove: () =>
        onChange({
          ...filters,
          brands: filters.brands!.filter((x) => x !== b),
        }),
    })
  );

  filters.sizes?.forEach((s) =>
    chips.push({
      key: `size-${s}`,
      label: `سایز ${s}`,
      remove: () =>
        onChange({
          ...filters,
          sizes: filters.sizes!.filter((x) => x !== s),
        }),
    })
  );

  filters.footTypes?.forEach((ft) =>
    chips.push({
      key: `ft-${ft}`,
      label: FOOT_TYPE_LABELS[ft].label,
      remove: () =>
        onChange({
          ...filters,
          footTypes: filters.footTypes!.filter((x) => x !== ft),
        }),
    })
  );

  filters.surfaces?.forEach((s) =>
    chips.push({
      key: `surf-${s}`,
      label: SURFACE_LABELS[s],
      remove: () =>
        onChange({
          ...filters,
          surfaces: filters.surfaces!.filter((x) => x !== s),
        }),
    })
  );

  if (filters.gender) {
    chips.push({
      key: "gender",
      label: filters.gender === "men" ? "مردانه" : "زنانه",
      remove: () => onChange({ ...filters, gender: undefined }),
    });
  }

  if (
    (filters.minPrice != null && filters.minPrice > 0) ||
    (filters.maxPrice != null && filters.maxPrice < 30_000_000)
  ) {
    chips.push({
      key: "price",
      label: `${formatToman(filters.minPrice ?? 0)} – ${formatToman(filters.maxPrice ?? 30_000_000)}`,
      remove: () =>
        onChange({ ...filters, minPrice: undefined, maxPrice: undefined }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.remove}
          className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="text-xs text-muted-foreground underline hover:text-foreground"
      >
        پاک کردن همه
      </button>
    </div>
  );
}
