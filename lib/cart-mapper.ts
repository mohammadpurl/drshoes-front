import type { Brand, CartItem } from "@/lib/types";
import type { CartLineRead, CartRead } from "@/types/cart.api";

const BRANDS: Brand[] = [
  "Adidas",
  "Nike",
  "On Running",
  "ASICS",
  "Hoka",
  "New Balance",
  "Saucony",
  "Brooks",
];

function asBrand(value: string | undefined): Brand {
  if (value && BRANDS.includes(value as Brand)) return value as Brand;
  return "Nike";
}

export function mapCartLineToItem(line: CartLineRead): CartItem {
  const product = line.product;
  const image =
    line.image ??
    product?.images?.[0] ??
    "";

  return {
    lineId: String(line.id ?? (line as { itemId?: string }).itemId ?? ""),
    productId: String(line.productId ?? product?.id ?? ""),
    slug: line.slug ?? product?.slug ?? "",
    name: line.name ?? product?.name ?? "محصول",
    brand: asBrand(
      typeof line.brand === "string"
        ? line.brand
        : (product?.brand as string | undefined)
    ),
    price: line.price ?? product?.price ?? 0,
    size: line.size,
    quantity: line.quantity,
    image,
  };
}

export function mapCartToItems(cart: CartRead): CartItem[] {
  return (cart.items ?? []).map(mapCartLineToItem);
}
