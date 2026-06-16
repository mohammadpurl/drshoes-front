"use client";

import { useEffect, useRef } from "react";
import { useCartActions } from "@/hooks/use-cart-actions";
import { useCartStore } from "@/store/cart-store";

/** بارگذاری اولیه سبد از API — پس از hydrate شدن توکن ذخیره‌شده */
export function CartSync() {
  const { refreshCart } = useCartActions();
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current) return;

    const runInitialSync = () => {
      if (synced.current) return;
      synced.current = true;
      void refreshCart();
    };

    if (useCartStore.persist.hasHydrated()) {
      runInitialSync();
      return;
    }

    return useCartStore.persist.onFinishHydration(runInitialSync);
  }, [refreshCart]);

  return null;
}
