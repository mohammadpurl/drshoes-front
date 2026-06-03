import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

interface CartState {
  items: CartItem[];
  promoCode: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  setPromoCode: (code: string) => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, size: number) => void;
  updateQuantity: (productId: string, size: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: "",
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
      setPromoCode: (code) => set({ promoCode: code }),
      addItem: (item) => {
        const qty = item.quantity ?? 1;
        const existing = get().items.find(
          (i) => i.productId === item.productId && i.size === item.size
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId && i.size === item.size
                ? { ...i, quantity: i.quantity + qty }
                : i
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...get().items, { ...item, quantity: qty }],
            isOpen: true,
          });
        }
      },
      removeItem: (productId, size) =>
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.size === size)
          ),
        }),
      updateQuantity: (productId, size, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId, size);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.size === size
              ? { ...i, quantity }
              : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    { name: "drshoes-cart" }
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
