"use client";

import { useRouter } from "next/navigation";
import type { Product, Review } from "@/lib/types";
import type { BreadcrumbItem } from "@/components/seo/breadcrumbs";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProductDetailView } from "./product-detail-view";

export function ProductPageShell({
  product,
  related = [],
  reviews = [],
  breadcrumbs = [],
}: {
  product: Product;
  related?: Product[];
  reviews?: Review[];
  breadcrumbs?: BreadcrumbItem[];
}) {
  const router = useRouter();

  return (
    <>
      <Header
        search=""
        onSearchChange={(q) => {
          if (q) router.push(`/?q=${encodeURIComponent(q)}`);
        }}
      />
      <ProductDetailView
        product={product}
        related={related}
        reviews={reviews}
        breadcrumbs={breadcrumbs}
      />
      <BottomNav />
      <CartDrawer />
    </>
  );
}
