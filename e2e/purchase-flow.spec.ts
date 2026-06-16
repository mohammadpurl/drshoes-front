import { test, expect } from "@playwright/test";

/**
 * سناریوی کامل خرید — نیاز به بک‌اند فعال روی localhost:8000
 *
 * متغیرهای محیطی:
 * - E2E_USER_USERNAME
 * - E2E_USER_PASSWORD
 * - E2E_PRODUCT_SLUG (اختیاری، پیش‌فرض: on-cloudmonster-2)
 */
const username = process.env.E2E_USER_USERNAME;
const password = process.env.E2E_USER_PASSWORD;
const productSlug = process.env.E2E_PRODUCT_SLUG ?? "on-cloudmonster-2";

const hasCredentials = Boolean(username && password);

test.describe("Purchase flow", () => {
  test.skip(!hasCredentials, "E2E_USER_USERNAME and E2E_USER_PASSWORD required");

  test("browse product, add to cart, open checkout", async ({ page }) => {
    await page.goto(`/products/${productSlug}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.getByRole("button", { name: "افزودن به سبد" }).click();
    await page.getByRole("button", { name: "سبد خرید" }).click();
    await expect(page.getByText("سبد خرید")).toBeVisible();

    await page.goto(`/login?redirect=${encodeURIComponent("/checkout")}`);
    await page.getByLabel("نام کاربری").fill(username!);
    await page.getByLabel("رمز عبور").fill(password!);
    await page.getByRole("button", { name: "ورود" }).click();

    await page.waitForURL("**/checkout**", { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "تکمیل خرید" })).toBeVisible();
  });

  test("profile orders page for authenticated user", async ({ page }) => {
    await page.goto(`/login?redirect=${encodeURIComponent("/profile/orders")}`);
    await page.getByLabel("نام کاربری").fill(username!);
    await page.getByLabel("رمز عبور").fill(password!);
    await page.getByRole("button", { name: "ورود" }).click();

    await page.waitForURL("**/profile/orders**", { timeout: 15_000 });
    await expect(
      page.getByRole("heading", { name: "سفارش‌های من" })
    ).toBeVisible();
  });
});
