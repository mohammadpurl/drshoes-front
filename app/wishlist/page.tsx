"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProductsByIdsAction } from "@/app/_actions/product-actions";
import { useWishlistStore } from "@/store/wishlist-store";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/types";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!ids.length) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getProductsByIdsAction(ids).then((result) => {
      if (result.success) {
        setProducts(result.data);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });
  }, [ids]);

  return (
    <>
      <Header
        search=""
        onSearchChange={(q) => {
          if (q) router.push(`/?q=${encodeURIComponent(q)}`);
        }}
      />
      <main className="page-container py-6 pb-24">
        <h1 className="mb-6 text-2xl font-bold">علاقه‌مندی‌ها</h1>
        {loading ? (
          <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <p>لیست علاقه‌مندی شما خالی است</p>
            <Link href="/" className="mt-4 inline-block text-primary underline">
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
      <CartDrawer />
    </>
  );
}
