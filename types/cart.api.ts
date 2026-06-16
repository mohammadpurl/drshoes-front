import type { Brand } from "@/lib/types";

/** `POST /cart/items` */
export type CartAddItemBody = {
  productId: string;
  size: number;
  quantity: number;
};

/** `PATCH /cart/items/{itemId}` */
export type CartUpdateItemBody = {
  quantity: number;
};

/** آیتم سبد از API */
export type CartLineRead = {
  id: string;
  productId: string;
  size: number;
  quantity: number;
  price?: number;
  slug?: string;
  name?: string;
  brand?: Brand | string;
  image?: string;
  product?: {
    id?: string;
    slug?: string;
    name?: string;
    brand?: Brand | string;
    price?: number;
    images?: string[];
  };
};

/** `GET /cart` */
export type CartRead = {
  items: CartLineRead[];
  subtotal?: number;
  total?: number;
};

export type CartActionData = {
  cart: CartRead;
  cartToken?: string;
};
