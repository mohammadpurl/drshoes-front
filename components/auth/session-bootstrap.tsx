"use client";

import { useEffect } from "react";
import { useSessionStore } from "@/app/_store/auth-store";

/** یک‌بار در کل اپ session را از کوکی می‌خواند */
export function SessionBootstrap() {
  const updateSession = useSessionStore((s) => s.updateSession);

  useEffect(() => {
    void updateSession();
  }, [updateSession]);

  return null;
}
