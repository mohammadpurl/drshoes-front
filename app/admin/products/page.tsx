import Link from "next/link";
import { Plus } from "lucide-react";
import { ProductsList } from "@/components/admin/products-list";
import { Button } from "@/components/ui/button";

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">محصولات</h1>
          <p className="text-sm text-muted-foreground">
            مدیریت کفش‌های فروشگاه
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            افزودن کفش
          </Link>
        </Button>
      </div>
      <ProductsList />
    </div>
  );
}
