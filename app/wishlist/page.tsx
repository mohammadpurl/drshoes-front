"use client";

import Link from "next/link";
import { products } from "@/data/products";
import { useWishlistStore } from "@/store/wishlist-store";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProductCard } from "@/components/product/product-card";
import { getCardAspectVariant } from "@/lib/card-layout";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const wished = products.filter((p) => ids.includes(p.id));
  const router = useRouter();

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
        {wished.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <p>لیست علاقه‌مندی شما خالی است</p>
            <Link href="/" className="mt-4 inline-block text-primary underline">
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="product-masonry columns-1 sm:columns-2 lg:columns-3">
            {wished.map((p, index) => (
              <div key={p.id} className="mb-5 break-inside-avoid sm:mb-6">
                <ProductCard
                  product={p}
                  aspectVariant={getCardAspectVariant(index)}
                />
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
      <CartDrawer />
    </>
  );
}
