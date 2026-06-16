import { Suspense } from "react";
import CheckoutSuccessPageClient from "./success-client";

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          در حال بارگذاری...
        </div>
      }
    >
      <CheckoutSuccessPageClient />
    </Suspense>
  );
}
