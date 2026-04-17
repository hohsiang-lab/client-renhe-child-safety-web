import { test, expect } from "@playwright/test";

// HO-773: 身體紅綠燈 v2 — 規則說明動畫頁
// Replaces HO-609 body-traffic-light.spec.ts

test.describe("身體紅綠燈 v2 — 規則說明動畫 (HO-773)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/body-traffic-light");
  });

  test("頁面載入後「我知道了！」按鈕不可見", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "我知道了！" }),
    ).not.toBeVisible();
  });

  test("三個說明文字依序出現，按鈕在全部出現後才顯示", async ({ page }) => {
    // Wait for all 3 lights + animation buffer (3 * 1500ms + 1000ms)
    await page.waitForTimeout(5500);

    await expect(page.getByText("普通朋友可以碰觸的地方")).toBeVisible();
    await expect(page.getByText("要先問我才能碰的地方")).toBeVisible();
    await expect(page.getByText("任何人都不能隨意碰的地方（除了家長和醫生）")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "我知道了！" }),
    ).toBeVisible();
  });

  test("三個燈的 emoji 都出現", async ({ page }) => {
    await page.waitForTimeout(5500);

    await expect(page.getByText("🟢")).toBeVisible();
    await expect(page.getByText("🟡")).toBeVisible();
    await expect(page.getByText("🔴")).toBeVisible();
  });

  test("點擊「我知道了！」導向人偶選擇頁", async ({ page }) => {
    await page.waitForTimeout(5500);
    await page.getByRole("button", { name: "我知道了！" }).click();
    await expect(page).toHaveURL("/body-traffic-light/pick-doll");
  });
});
