"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

const links = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/?category=all", label: "دسته‌ها", icon: LayoutGrid },
  { href: "/wishlist", label: "علاقه‌مندی", icon: Heart },
  { href: "#cart", label: "سبد", icon: ShoppingBag, cart: true },
  { href: "/profile", label: "پروفایل", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const setCartOpen = useCartStore((s) => s.setOpen);
  const cartCount = useCartStore((s) =>
    s.items.reduce((n, i) => n + i.quantity, 0)
  );
  const wishCount = useWishlistStore((s) => s.ids.length);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {links.map(({ href, label, icon: Icon, cart }) => {
          const active = pathname === href && !cart;
          const badge = cart ? cartCount : label === "علاقه‌مندی" ? wishCount : 0;

          if (cart) {
            return (
              <button
                key={href}
                type="button"
                onClick={() => setCartOpen(true)}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1 text-xs text-muted-foreground"
                )}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {badge > 0 && (
                    <span className="absolute -top-1 -start-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[9px] text-white">
                      {badge}
                    </span>
                  )}
                </span>
                {label}
              </button>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors",
                active ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              <span className="relative">
                <Icon className="h-5 w-5" />
                {badge > 0 && label === "علاقه‌مندی" && (
                  <span className="absolute -top-1 -start-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[9px] text-white">
                    {badge}
                  </span>
                )}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
