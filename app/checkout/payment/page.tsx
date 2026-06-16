import { Suspense } from "react";
import CheckoutPaymentPageClient from "./payment-client";

export default function CheckoutPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          در حال بارگذاری...
        </div>
      }
    >
      <CheckoutPaymentPageClient />
    </Suspense>
  );
}
