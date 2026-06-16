"use client";

import { useCallback } from "react";
import {
  addCartItemAction,
  getCartAction,
  removeCartItemAction,
  updateCartItemAction,
} from "@/app/_actions/cart-actions";
import { notifyError } from "@/lib/notify-action";
import type { CartItem } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";

let cartMutationSeq = 0;

function beginCartMutation(): number {
  cartMutationSeq += 1;
  return cartMutationSeq;
}

function isLatestCartMutation(op: number): boolean {
  return op === cartMutationSeq;
}

function applyCartResult(
  data: { items: CartItem[]; cartToken?: string },
  setItems: (items: CartItem[]) => void,
  setCartToken: (token: string | null) => void
) {
  setItems(data.items);
  if (data.cartToken) {
    setCartToken(data.cartToken);
    return;
  }
  if (data.items.length === 0) {
    return;
  }
  setCartToken(null);
}

/** عملیات سبد */
export function useCartActions() {
  const setCartToken = useCartStore((s) => s.setCartToken);
  const setItems = useCartStore((s) => s.setItems);
  const setOpen = useCartStore((s) => s.setOpen);
  const setSyncing = useCartStore((s) => s.setSyncing);

  const refreshCart = useCallback(async () => {
    const op = beginCartMutation();
    setSyncing(true);

    const cartToken = useCartStore.getState().cartToken;
    const result = await getCartAction(cartToken ?? undefined);

    if (!isLatestCartMutation(op)) {
      return result;
    }

    setSyncing(false);
    if (result.success) {
      applyCartResult(result.data, setItems, setCartToken);
    }
    return result;
  }, [setCartToken, setItems, setSyncing]);

  const addItem = useCallback(
    async (
      item: Omit<CartItem, "quantity" | "lineId"> & { quantity?: number }
    ) => {
      const op = beginCartMutation();
      setSyncing(true);

      const cartToken = useCartStore.getState().cartToken;
      const result = await addCartItemAction(
        {
          productId: item.productId,
          size: item.size,
          quantity: item.quantity ?? 1,
        },
        cartToken ?? undefined
      );

      if (!isLatestCartMutation(op)) {
        return { success: false as const, error: "درخواست منقضی شد" };
      }

      setSyncing(false);

      if (result.success) {
        applyCartResult(result.data, setItems, setCartToken);
        setOpen(true);
        return { success: true as const };
      }

      notifyError(result.error);
      return { success: false as const, error: result.error };
    },
    [setCartToken, setItems, setOpen, setSyncing]
  );

  const removeItem = useCallback(
    async (item: CartItem) => {
      if (!item.lineId) {
        notifyError("شناسه آیتم سبد یافت نشد. سبد را بازخوانی کنید.");
        void refreshCart();
        return;
      }

      const op = beginCartMutation();
      const snapshot = useCartStore.getState().items;
      setItems(snapshot.filter((i) => i.lineId !== item.lineId));
      setSyncing(true);

      const cartToken = useCartStore.getState().cartToken;
      const result = await removeCartItemAction(
        item.lineId,
        cartToken ?? undefined
      );

      if (!isLatestCartMutation(op)) {
        return;
      }

      setSyncing(false);

      if (result.success) {
        applyCartResult(result.data, setItems, setCartToken);
        return;
      }

      setItems(snapshot);
      notifyError(result.error);
    },
    [setCartToken, setItems, setSyncing, refreshCart]
  );

  const updateQuantity = useCallback(
    async (item: CartItem, quantity: number) => {
      if (quantity <= 0) {
        await removeItem(item);
        return;
      }

      if (!item.lineId) {
        notifyError("شناسه آیتم سبد یافت نشد. سبد را بازخوانی کنید.");
        void refreshCart();
        return;
      }

      const op = beginCartMutation();
      setSyncing(true);

      const cartToken = useCartStore.getState().cartToken;
      const result = await updateCartItemAction(
        item.lineId,
        { quantity },
        cartToken ?? undefined
      );

      if (!isLatestCartMutation(op)) {
        return;
      }

      setSyncing(false);

      if (result.success) {
        applyCartResult(result.data, setItems, setCartToken);
        return;
      }

      notifyError(result.error);
    },
    [setCartToken, setItems, setSyncing, removeItem, refreshCart]
  );

  return {
    addItem,
    updateQuantity,
    removeItem,
    refreshCart,
  };
}
