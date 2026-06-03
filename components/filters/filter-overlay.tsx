"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FilterPanel } from "./filter-panel";
import { Button } from "@/components/ui/button";
import type { ProductFilters } from "@/lib/types";
import { useUiStore } from "@/store/ui-store";

interface FilterOverlayProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  onClear: () => void;
  resultCount?: number;
}

export function FilterOverlay({
  filters,
  onChange,
  onClear,
  resultCount,
}: FilterOverlayProps) {
  const open = useUiStore((s) => s.filterSheetOpen);
  const setOpen = useUiStore((s) => s.setFilterSheetOpen);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="بستن فیلترها"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="فیلترها"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-y-0 start-0 z-[70] flex w-full max-w-full flex-col bg-background shadow-2xl sm:max-w-[420px]"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-4">
              <h2 className="text-lg font-bold">فیلترها</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-muted"
                aria-label="بستن"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
              <FilterPanel filters={filters} onChange={onChange} />
            </div>

            <footer className="shrink-0 space-y-2 border-t border-border bg-background p-4">
              <Button
                className="w-full"
                size="lg"
                onClick={() => setOpen(false)}
              >
                {resultCount != null
                  ? `مشاهده ${resultCount.toLocaleString("fa-IR")} محصول`
                  : "اعمال فیلتر"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  onClear();
                  setOpen(false);
                }}
              >
                پاک کردن همه فیلترها
              </Button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
