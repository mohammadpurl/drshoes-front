/** نتیجه استاندارد Server Actions */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type ActionVoidResult =
  | { success: true }
  | { success: false; error: string };
