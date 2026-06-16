"use client";

import { useEffect } from "react";

type UseOrderRefreshOptions = {
  enabled: boolean;
  onRefresh: () => void;
  intervalMs?: number;
};

export function useOrderRefresh({
  enabled,
  onRefresh,
  intervalMs = 30000,
}: UseOrderRefreshOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleFocus = () => onRefresh();
    window.addEventListener("focus", handleFocus);

    const timer = window.setInterval(onRefresh, intervalMs);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.clearInterval(timer);
    };
  }, [enabled, intervalMs, onRefresh]);
}
