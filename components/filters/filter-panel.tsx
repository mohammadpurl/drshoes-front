"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import { formatToman } from "@/lib/format";
import {
  BRANDS,
  FOOT_TYPE_LABELS,
  PRICE_MAX,
  SIZES,
  SURFACE_LABELS,
} from "@/lib/constants";
import type { Brand, FootType, Gender, ProductFilters, SortOption, Surface } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface FilterPanelProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
}

function toggleArray<T>(arr: T[] | undefined, value: T): T[] {
  const list = arr ?? [];
  return list.includes(value)
    ? list.filter((x) => x !== value)
    : [...list, value];
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const priceRange: [number, number] = [
    filters.minPrice ?? 0,
    filters.maxPrice ?? PRICE_MAX,
  ];

  return (
    <div className="space-y-6 text-sm">
      <section>
        <h3 className="mb-3 font-semibold">برند</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {BRANDS.map((brand) => {
            const selected = filters.brands?.includes(brand as Brand) ?? false;
            return (
              <label
                key={brand}
                className={cn(
                  "relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-3 transition",
                  selected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border bg-card hover:border-primary/35 hover:bg-muted/40"
                )}
              >
                <Checkbox
                  checked={selected}
                  className="absolute start-2 top-2"
                  onCheckedChange={() =>
                    onChange({
                      ...filters,
                      brands: toggleArray(filters.brands, brand as Brand),
                    })
                  }
                />
                <div className="flex h-14 w-full items-center justify-center rounded-lg bg-muted/60 px-2 pt-4">
                  <BrandLogo brand={brand as Brand} prominent />
                </div>
                <span className="text-center text-xs font-medium text-foreground">
                  {brand}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="mb-3 font-semibold">سایز</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  sizes: toggleArray(filters.sizes, size),
                })
              }
              className={`rounded-lg border px-3 py-1 text-xs transition ${
                filters.sizes?.includes(size)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="mb-3 font-semibold">نوع قوس پا</h3>
        <div className="space-y-2">
          {(Object.keys(FOOT_TYPE_LABELS) as FootType[]).map((ft) => (
            <label key={ft} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.footTypes?.includes(ft) ?? false}
                onCheckedChange={() =>
                  onChange({
                    ...filters,
                    footTypes: toggleArray(filters.footTypes, ft),
                  })
                }
              />
              <span>
                {FOOT_TYPE_LABELS[ft].emoji} {FOOT_TYPE_LABELS[ft].label}
              </span>
            </label>
          ))}
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="mb-3 font-semibold">سطح</h3>
        <div className="space-y-2">
          {(Object.keys(SURFACE_LABELS) as Surface[]).map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.surfaces?.includes(s) ?? false}
                onCheckedChange={() =>
                  onChange({
                    ...filters,
                    surfaces: toggleArray(filters.surfaces, s),
                  })
                }
              />
              <span>{SURFACE_LABELS[s]}</span>
            </label>
          ))}
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="mb-3 font-semibold">محدوده قیمت</h3>
        <Slider
          min={0}
          max={PRICE_MAX}
          step={500_000}
          value={priceRange}
          onValueChange={([min, max]) =>
            onChange({ ...filters, minPrice: min, maxPrice: max })
          }
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{formatToman(priceRange[0])}</span>
          <span>{formatToman(priceRange[1])}</span>
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="mb-3 font-semibold">جنسیت</h3>
        <RadioGroup
          value={filters.gender ?? "all"}
          onValueChange={(v) =>
            onChange({
              ...filters,
              gender: v === "all" ? undefined : (v as Gender),
            })
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="all" id="g-all" />
            <Label htmlFor="g-all">همه</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="men" id="g-men" />
            <Label htmlFor="g-men">مردانه</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="women" id="g-women" />
            <Label htmlFor="g-women">زنانه</Label>
          </div>
        </RadioGroup>
      </section>

      <Separator />

      <section>
        <h3 className="mb-3 font-semibold">مرتب‌سازی</h3>
        <RadioGroup
          value={filters.sort ?? "newest"}
          onValueChange={(v) =>
            onChange({ ...filters, sort: v as SortOption })
          }
        >
          {[
            { value: "newest", label: "جدیدترین" },
            { value: "bestseller", label: "پرفروش‌ترین" },
            { value: "price_asc", label: "ارزان‌ترین" },
            { value: "price_desc", label: "گران‌ترین" },
          ].map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2">
              <RadioGroupItem value={value} id={`sort-${value}`} />
              <Label htmlFor={`sort-${value}`}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
      </section>
    </div>
  );
}
