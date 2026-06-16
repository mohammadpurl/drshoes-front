"use client";

import { useState, useTransition } from "react";
import { suggestProductSlugAction } from "@/app/_actions/upload-actions";
import {
  BRANDS,
  FOOT_TYPE_LABELS,
  SURFACE_LABELS,
} from "@/lib/constants";
import {
  emptyProductForm,
  formToPayload,
  slugifyName,
  type ProductFormState,
} from "@/lib/admin-product-form";
import type { ProductUpsertPayload } from "@/lib/admin-product-form";
import type { Brand, Category, FootType, Gender, Surface } from "@/lib/types";
import { ProductMediaUpload } from "@/components/admin/product-media-upload";
import { notifyError } from "@/lib/notify-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "running", label: "دویدن" },
  { value: "trail", label: "تریل" },
  { value: "race", label: "مسابقه" },
  { value: "training", label: "تمرین" },
  { value: "walking", label: "پیاده‌روی" },
];

const GENDERS: { value: Gender; label: string }[] = [
  { value: "unisex", label: "مشترک" },
  { value: "men", label: "مردانه" },
  { value: "women", label: "زنانه" },
];

interface ProductFormProps {
  initial?: ProductFormState;
  submitLabel: string;
  onSubmit: (payload: ProductUpsertPayload) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

export function ProductForm({
  initial,
  submitLabel,
  onSubmit,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormState>(
    initial ?? emptyProductForm()
  );
  const [pending, startTransition] = useTransition();

  const update = <K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K]
  ) => setForm((f) => ({ ...f, [key]: value }));

  const toggleFoot = (ft: FootType) => {
    setForm((f) => ({
      ...f,
      footType: f.footType.includes(ft)
        ? f.footType.filter((x) => x !== ft)
        : [...f.footType, ft],
    }));
  };

  const toggleSurface = (s: Surface) => {
    setForm((f) => ({
      ...f,
      surface: f.surface.includes(s)
        ? f.surface.filter((x) => x !== s)
        : [...f.surface, s],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      notifyError("نام و اسلاگ محصول الزامی است.");
      return;
    }
    if (form.images.length === 0 && form.videos.length === 0) {
      notifyError("حداقل یک تصویر یا ویدئو آپلود کنید.");
      return;
    }

    startTransition(async () => {
      const result = await onSubmit(formToPayload(form));
      if (!result.success && result.error) {
        notifyError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h2 className="font-semibold">اطلاعات اصلی</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">نام کفش</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                update("name", name);
                if (!initial) update("slug", slugifyName(name));
              }}
              onBlur={async () => {
                if (initial || !form.name.trim()) return;
                const result = await suggestProductSlugAction(form.name);
                if (result.success && result.data) {
                  update("slug", result.data);
                }
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">اسلاگ (URL)</Label>
            <Input
              id="slug"
              dir="ltr"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand">برند</Label>
            <select
              id="brand"
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              value={form.brand}
              onChange={(e) => update("brand", e.target.value as Brand)}
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">دسته</Label>
            <select
              id="category"
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              value={form.category}
              onChange={(e) => update("category", e.target.value as Category)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">جنسیت</Label>
            <select
              id="gender"
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              value={form.gender}
              onChange={(e) => update("gender", e.target.value as Gender)}
            >
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h2 className="font-semibold">قیمت و سایز</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="price">قیمت (تومان)</Label>
            <Input
              id="price"
              type="number"
              dir="ltr"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="originalPrice">قیمت قبل تخفیف</Label>
            <Input
              id="originalPrice"
              type="number"
              dir="ltr"
              value={form.originalPrice}
              onChange={(e) => update("originalPrice", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount">درصد تخفیف</Label>
            <Input
              id="discount"
              type="number"
              dir="ltr"
              value={form.discount}
              onChange={(e) => update("discount", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="sizes">سایزهای موجود (با ویرگول)</Label>
            <Input
              id="sizes"
              dir="ltr"
              value={form.sizes}
              onChange={(e) => update("sizes", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unavailableSizes">سایز ناموجود</Label>
            <Input
              id="unavailableSizes"
              dir="ltr"
              value={form.unavailableSizes}
              onChange={(e) => update("unavailableSizes", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h2 className="font-semibold">مشخصات فنی</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="drop">دراپ (mm)</Label>
            <Input
              id="drop"
              type="number"
              dir="ltr"
              value={form.drop}
              onChange={(e) => update("drop", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">وزن (گرم)</Label>
            <Input
              id="weight"
              type="number"
              dir="ltr"
              value={form.weight}
              onChange={(e) => update("weight", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stackHeight">ارتفاع میان‌کف</Label>
            <Input
              id="stackHeight"
              type="number"
              dir="ltr"
              value={form.stackHeight}
              onChange={(e) => update("stackHeight", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>نوع پا</Label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(FOOT_TYPE_LABELS) as FootType[]).map((ft) => (
              <button
                key={ft}
                type="button"
                onClick={() => toggleFoot(ft)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs",
                  form.footType.includes(ft)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border"
                )}
              >
                {FOOT_TYPE_LABELS[ft].label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>سطح</Label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SURFACE_LABELS) as Surface[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSurface(s)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs",
                  form.surface.includes(s)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border"
                )}
              >
                {SURFACE_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={form.isNew}
              onCheckedChange={(v) => update("isNew", v === true)}
            />
            محصول جدید
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={form.isBestseller}
              onCheckedChange={(v) => update("isBestseller", v === true)}
            />
            پرفروش
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h2 className="font-semibold">توضیحات و تصاویر</h2>
        <div className="space-y-2">
          <Label htmlFor="description">توضیحات</Label>
          <textarea
            id="description"
            rows={4}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">برچسب‌ها (با ویرگول)</Label>
          <Input
            id="tags"
            value={form.tags}
            onChange={(e) => update("tags", e.target.value)}
          />
        </div>
        <ProductMediaUpload
          slug={form.slug}
          images={form.images}
          videos={form.videos}
          onImagesChange={(urls) => update("images", urls)}
          onVideosChange={(urls) => update("videos", urls)}
        />
      </section>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "در حال ذخیره..." : submitLabel}
      </Button>
    </form>
  );
}
