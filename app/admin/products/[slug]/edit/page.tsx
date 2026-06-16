"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import {
  getAdminProductBySlugAction,
  updateAdminProductAction,
} from "@/app/_actions/product-actions";
import { productToForm } from "@/lib/admin-product-form";
import { notifyError, notifySuccess } from "@/lib/notify-action";
import { Button } from "@/components/ui/button";

export default function AdminEditProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [productId, setProductId] = useState<string | null>(null);
  const [initial, setInitial] = useState<ReturnType<typeof productToForm> | null>(
    null
  );

  useEffect(() => {
    if (!slug) return;
    getAdminProductBySlugAction(slug).then((result) => {
      if (result.success) {
        setProductId(result.data.id);
        setInitial(productToForm(result.data));
      } else {
        notifyError(result.error);
      }
    });
  }, [slug]);

  if (!initial || !productId) {
    return (
      <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">ویرایش محصول</h1>
          <p className="text-sm text-muted-foreground">{initial.name}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          بازگشت
        </Button>
      </div>
      <ProductForm
        initial={initial}
        submitLabel="ذخیره تغییرات"
        onSubmit={async (payload) => {
          const result = await updateAdminProductAction(productId, payload);
          if (result.success) {
            notifySuccess("تغییرات ذخیره شد");
            router.push("/admin/products");
            return { success: true };
          }
          return { success: false, error: result.error };
        }}
      />
    </div>
  );
}
