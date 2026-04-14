import { test, expect } from "@playwright/test";

test.describe("首頁 (HO-606)", () => {
  test("顯示標題、角色區域、開始按鈕", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "保護自己大冒險" })).toBeVisible();
    await expect(page.getByRole("button", { name: /開始探險/ })).toBeVisible();
    await expect(page.getByText("👦")).toBeVisible();
    await expect(page.getByText("👧")).toBeVisible();
  });

  test("點擊「開始探險」導航至選單頁", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /開始探險/ }).click();
    await expect(page).toHaveURL("/menu");
  });

  test("開始按鈕觸控目標 ≥ 48px", async ({ page }) => {
    await page.goto("/");

    const btn = page.getByRole("button", { name: /開始探險/ });
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(48);
    expect(box!.width).toBeGreaterThanOrEqual(48);
  });
});
