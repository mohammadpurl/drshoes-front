import { test, expect } from "@playwright/test";

test.describe("Smoke", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByPlaceholder("جستجوی کفش، برند...")).toBeVisible();
  });

  test("products page loads", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("main")).toBeVisible();
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "ورود" })).toBeVisible();
  });
});
