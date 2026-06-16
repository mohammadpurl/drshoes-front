import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CustomerRegisterForm } from "@/components/auth/customer-register-form";

export default function RegisterPage() {
  return (
    <main className="page-container flex min-h-screen flex-col items-center justify-center py-8">
      <div className="mb-6 flex w-full max-w-sm items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          فروشگاه
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">ثبت‌نام</span>
      </div>

      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">در حال بارگذاری...</div>
        }
      >
        <CustomerRegisterForm />
      </Suspense>
    </main>
  );
}
