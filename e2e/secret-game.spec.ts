import { test, expect } from "@playwright/test";

test.describe("秘密遊戲 (HO-997) — 圖片卡片翻面", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/secret-game");
  });

  test("顯示 intro 頁：好秘密 / 壞秘密 選擇按鈕", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /秘密遊戲/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /好秘密/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /壞秘密/ })).toBeVisible();
  });

  test("點擊好秘密按鈕 → 進入 7 張卡片 grid", async ({ page }) => {
    await page.getByRole("button", { name: /好秘密/ }).click();
    await expect(page.getByRole("heading", { name: /秘密卡片/ })).toBeVisible();
    await expect(page.getByTestId("card-front-1")).toBeVisible();
    await expect(page.getByTestId("card-front-7")).toBeVisible();
  });

  test("點擊壞秘密按鈕 → 進入 7 張卡片 grid", async ({ page }) => {
    await page.getByRole("button", { name: /壞秘密/ }).click();
    await expect(page.getByRole("heading", { name: /秘密卡片/ })).toBeVisible();
    // 7 張卡片的正面圖片都存在
    for (let i = 1; i <= 7; i++) {
      await expect(page.getByTestId(`card-front-${i}`)).toBeAttached();
    }
  });

  test("翻面後壞秘密卡片顯示「誰是信任的大人？」CTA", async ({ page }) => {
    await page.getByRole("button", { name: /好秘密/ }).click();
    // 卡片 2 是壞秘密：點擊正面觸發翻面
    await page.getByTestId("card-front-2").click();
    await page.waitForTimeout(400); // 等翻面動畫
    await expect(page.getByTestId("trusted-adults-cta-2")).toBeVisible();
  });

  test("好秘密卡片翻面後不顯示 CTA", async ({ page }) => {
    await page.getByRole("button", { name: /好秘密/ }).click();
    // 卡片 1 是好秘密
    await page.getByTestId("card-front-1").click();
    await page.waitForTimeout(400);
    await expect(page.getByTestId("trusted-adults-cta-1")).not.toBeAttached();
  });

  test("壞秘密 CTA → 進入信任的大人頁面，「我知道了」返回 grid", async ({ page }) => {
    await page.getByRole("button", { name: /好秘密/ }).click();
    await page.getByTestId("card-front-2").click();
    await page.waitForTimeout(400);
    await page.getByTestId("trusted-adults-cta-2").click();
    await expect(page.getByRole("heading", { name: /信任的大人/ })).toBeVisible();
    await page.getByRole("button", { name: "我知道了" }).click();
    await expect(page.getByRole("heading", { name: /秘密卡片/ })).toBeVisible();
  });

  test("翻閱所有 7 張後顯示「完成遊戲」按鈕", async ({ page }) => {
    await page.getByRole("button", { name: /好秘密/ }).click();
    await expect(page.getByTestId("complete-button")).not.toBeVisible();

    for (let i = 1; i <= 7; i++) {
      await page.getByTestId(`card-front-${i}`).click();
      await page.waitForTimeout(50);
    }

    await expect(page.getByTestId("complete-button")).toBeVisible();
  });

  test("完成遊戲按鈕 → 導向 /ending", async ({ page }) => {
    await page.getByRole("button", { name: /好秘密/ }).click();

    for (let i = 1; i <= 7; i++) {
      await page.getByTestId(`card-front-${i}`).click();
      await page.waitForTimeout(50);
    }

    await page.getByTestId("complete-button").click();
    await expect(page).toHaveURL("/ending");
  });

  test("從選單可進入秘密遊戲", async ({ page }) => {
    await page.goto("/menu");
    await page.getByRole("button", { name: /秘密遊戲/ }).click();
    await expect(page).toHaveURL("/secret-game");
    await expect(page.getByRole("heading", { name: /秘密遊戲/ })).toBeVisible();
  });
});
