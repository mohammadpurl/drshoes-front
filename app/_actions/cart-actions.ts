"use server";

import {
  cartDelete,
  cartGet,
  cartPatch,
  cartPost,
} from "@/app/core/http-service/http-service";
import { extractActionErrorMessage } from "@/app/_actions/extract-action-error";
import { mapCartToItems } from "@/lib/cart-mapper";
import {
  extractCartTokenFromBody,
  unwrapCartRead,
} from "@/lib/normalize-cart";
import type { CartItem } from "@/lib/types";
import type {
  CartAddItemBody,
  CartUpdateItemBody,
} from "@/types/cart.api";
import type { ActionResult } from "@/types/action.types";

export type CartItemsData = {
  items: CartItem[];
  cartToken?: string;
};

function toItemsData(
  raw: unknown,
  headerToken?: string,
  fallbackToken?: string
): CartItemsData {
  const cart = unwrapCartRead(raw);
  const bodyToken = extractCartTokenFromBody(raw);
  return {
    items: mapCartToItems(cart),
    cartToken: headerToken ?? bodyToken ?? fallbackToken,
  };
}

/** پاسخ mutate سبد در بک‌اند اغلب `items: []` است — سبد کامل را با GET می‌خوانیم */
async function afterCartMutation(
  raw: unknown,
  headerToken?: string,
  fallbackToken?: string
): Promise<CartItemsData> {
  const token = headerToken ?? extractCartTokenFromBody(raw) ?? fallbackToken;

  try {
    const { data, cartToken: nextToken } = await cartGet<unknown>(
      "/cart",
      token ?? undefined
    );
    return toItemsData(data, nextToken, token ?? fallbackToken);
  } catch {
    return toItemsData(raw, headerToken, fallbackToken);
  }
}

/** `GET /cart` */
export async function getCartAction(
  cartToken?: string
): Promise<ActionResult<CartItemsData>> {
  try {
    const { data, cartToken: nextToken } = await cartGet<unknown>(
      "/cart",
      cartToken
    );
    return {
      success: true,
      data: toItemsData(data, nextToken, cartToken),
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت سبد خرید"),
    };
  }
}

/** `POST /cart/items` */
export async function addCartItemAction(
  body: CartAddItemBody,
  cartToken?: string
): Promise<ActionResult<CartItemsData>> {
  try {
    const { data, cartToken: nextToken } = await cartPost<
      CartAddItemBody,
      unknown
    >("/cart/items", body, cartToken);
    return {
      success: true,
      data: await afterCartMutation(data, nextToken, cartToken),
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در افزودن به سبد"),
    };
  }
}

/** `PATCH /cart/items/{itemId}` */
export async function updateCartItemAction(
  itemId: string,
  body: CartUpdateItemBody,
  cartToken?: string
): Promise<ActionResult<CartItemsData>> {
  try {
    const { data, cartToken: nextToken } = await cartPatch<
      CartUpdateItemBody,
      unknown
    >(`/cart/items/${itemId}`, body, cartToken);
    return {
      success: true,
      data: await afterCartMutation(data, nextToken, cartToken),
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در به‌روزرسانی سبد"),
    };
  }
}

/** `DELETE /cart/items/{itemId}` */
export async function removeCartItemAction(
  itemId: string,
  cartToken?: string
): Promise<ActionResult<CartItemsData>> {
  try {
    const { data, cartToken: nextToken } = await cartDelete<unknown>(
      `/cart/items/${itemId}`,
      cartToken
    );
    return {
      success: true,
      data: await afterCartMutation(data, nextToken, cartToken),
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در حذف از سبد"),
    };
  }
}

/** `DELETE /cart` */
export async function clearCartAction(
  cartToken?: string
): Promise<ActionResult<CartItemsData>> {
  try {
    const { data, cartToken: nextToken } = await cartDelete<unknown>(
      "/cart",
      cartToken
    );
    return {
      success: true,
      data: await afterCartMutation(
        data ?? { items: [] },
        nextToken,
        cartToken
      ),
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در خالی کردن سبد"),
    };
  }
}
