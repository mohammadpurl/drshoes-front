"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { createAdminProductAction } from "@/app/_actions/product-actions";
import { notifySuccess } from "@/lib/notify-action";

export default function AdminNewProductPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">افزودن کفش جدید</h1>
        <p className="text-sm text-muted-foreground">
          اطلاعات را وارد کنید و ذخیره کنید
        </p>
      </div>
      <ProductForm
        submitLabel="ثبت محصول"
        onSubmit={async (payload) => {
          const result = await createAdminProductAction(payload);
          if (result.success) {
            notifySuccess("محصول با موفقیت ثبت شد");
            router.push("/admin/products");
            return { success: true };
          }
          return { success: false, error: result.error };
        }}
      />
    </div>
  );
}
