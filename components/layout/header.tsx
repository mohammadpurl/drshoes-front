"use client";

import Link from "next/link";
import { Search, ShoppingBag, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { UserMenu } from "@/components/layout/user-menu";
import { useCartStore } from "@/store/cart-store";
import { motion } from "framer-motion";

interface HeaderProps {
  search?: string;
  onSearchChange?: (value: string) => void;
}

export function Header({ search = "", onSearchChange }: HeaderProps) {
  const items = useCartStore((s) => s.items);
  const setOpen = useCartStore((s) => s.setOpen);
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <PageContainer className="flex min-w-0 items-center gap-2 py-2.5 sm:gap-3 sm:py-3">
        <Link href="/" className="shrink-0">
          <motion.div
            dir="ltr"
            className="flex items-center gap-0.5 sm:gap-1"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-lg font-black text-primary sm:text-xl">Dr.</span>
            <span className="text-lg font-bold sm:text-xl">Shoes</span>
            <span className="hidden text-xs text-muted-foreground md:inline">
              Running
            </span>
          </motion.div>
        </Link>

        <div className="relative min-w-0 flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="جستجوی کفش، برند..."
            className="ps-9 pe-3"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative shrink-0"
          onClick={() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
          aria-label="تغییر تم"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative shrink-0"
          onClick={() => setOpen(true)}
          aria-label="سبد خرید"
        >
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -top-0.5 -start-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </Button>

        <UserMenu />
      </PageContainer>
    </header>
  );
}
