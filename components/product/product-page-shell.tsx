"use client";

import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProductDetailView } from "./product-detail-view";

export function ProductPageShell({ product }: { product: Product }) {
  const router = useRouter();

  return (
    <>
      <Header
        search=""
        onSearchChange={(q) => {
          if (q) router.push(`/?q=${encodeURIComponent(q)}`);
        }}
      />
      <ProductDetailView product={product} />
      <BottomNav />
      <CartDrawer />
    </>
  );
}
