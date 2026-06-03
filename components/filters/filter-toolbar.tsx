"use client";

import { SlidersHorizontal } from "lucide-react";
import { useUiStore } from "@/store/ui-store";
import { countActiveFilters } from "@/lib/count-active-filters";
import type { ProductFilters } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/layout/page-container";

interface FilterToolbarProps {
  filters: ProductFilters;
  total?: number;
  isLoading?: boolean;
}

export function FilterToolbar({
  filters,
  total,
  isLoading,
}: FilterToolbarProps) {
  const setOpen = useUiStore((s) => s.setFilterSheetOpen);
  const activeCount = countActiveFilters(filters);

  return (
    <div
      className={cn(
        "sticky top-[57px] z-30 border-b border-border bg-background/95 backdrop-blur-md",
        "supports-[backdrop-filter]:bg-background/80"
      )}
    >
      <PageContainer className="flex min-w-0 items-center justify-between gap-3 py-2.5 sm:gap-4 sm:py-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border-2 border-foreground bg-background px-3 py-2 text-sm font-bold transition-colors hover:bg-muted sm:px-4 sm:py-2.5"
        >
          <SlidersHorizontal className="h-4 w-4 shrink-0" />
          <span>فیلتر</span>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>

        <p className="shrink-0 text-xs text-muted-foreground sm:text-sm">
          {isLoading ? (
            "در حال بارگذاری..."
          ) : total != null ? (
            <>
              <span className="font-semibold text-foreground">
                {total.toLocaleString("fa-IR")}
              </span>{" "}
              محصول
            </>
          ) : null}
        </p>
      </PageContainer>
    </div>
  );
}
