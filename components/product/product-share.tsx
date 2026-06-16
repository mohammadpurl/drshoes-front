"use client";

import { Share2 } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/constants";
import { absoluteUrl, productPath } from "@/lib/seo/site";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function ProductShare({ product }: { product: Product }) {
  const pageUrl = absoluteUrl(productPath(product.slug));
  const href = getWhatsAppUrl(
    `این کفش رو ببین: ${product.name} — ${pageUrl}`
  );

  return (
    <Button variant="outline" size="sm" asChild>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="اشتراک‌گذاری در واتساپ"
      >
        <Share2 className="h-4 w-4" />
        اشتراک در واتساپ
      </a>
    </Button>
  );
}
