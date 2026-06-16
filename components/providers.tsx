"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Notifications } from "@/components/notification/notifications";
import { CartSync } from "@/components/cart/cart-sync";
import { SessionBootstrap } from "@/components/auth/session-bootstrap";
import { AppThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <SessionBootstrap />
        <CartSync />
        {children}
        <Notifications />
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
