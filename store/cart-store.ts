import { create } from "zustand";
import { persist } from "zustand/middleware";
import { writeCartToken } from "@/lib/cart-token";
import type { CartItem } from "@/lib/types";

interface CartState {
  items: CartItem[];
  cartToken: string | null;
  promoCode: string;
  isOpen: boolean;
  isSyncing: boolean;
  setOpen: (open: boolean) => void;
  setPromoCode: (code: string) => void;
  setCartToken: (token: string | null) => void;
  setItems: (items: CartItem[]) => void;
  setSyncing: (syncing: boolean) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      cartToken: null,
      promoCode: "",
      isOpen: false,
      isSyncing: false,
      setOpen: (open) => set({ isOpen: open }),
      setPromoCode: (code) => set({ promoCode: code }),
      setCartToken: (token) => {
        writeCartToken(token);
        set({ cartToken: token });
      },
      setItems: (items) => set({ items }),
      setSyncing: (isSyncing) => set({ isSyncing }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "drshoes-cart",
      partialize: (state) => ({
        cartToken: state.cartToken,
        promoCode: state.promoCode,
      }),
    }
  )
);

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function getPromoDiscount(subtotal: number, code: string): number {
  const normalized = code.trim().toUpperCase();
  if (normalized === "DRSHOES10") return Math.round(subtotal * 0.1);
  if (normalized === "RUNNING5") return Math.round(subtotal * 0.05);
  return 0;
}
