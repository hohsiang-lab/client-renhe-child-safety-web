import { test, expect } from "@playwright/test";

test.describe("遊戲選單頁 (HO-607)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/menu");
  });

  test("顯示三張遊戲模組卡片", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "選擇你想玩的遊戲" })).toBeVisible();
    await expect(page.getByRole("button", { name: /秘密遊戲/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /身體紅綠燈/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /信任大人/ })).toBeVisible();
  });

  test("點擊秘密遊戲卡片導航至 /secret-game", async ({ page }) => {
    await page.getByRole("button", { name: /秘密遊戲/ }).click();
    await expect(page).toHaveURL("/secret-game");
  });

  test("點擊身體紅綠燈卡片導航至 /body-traffic-light", async ({ page }) => {
    await page.getByRole("button", { name: /身體紅綠燈/ }).click();
    await expect(page).toHaveURL("/body-traffic-light");
  });

  test("點擊信任大人卡片導航至 /trusted-adult", async ({ page }) => {
    await page.getByRole("button", { name: /信任大人/ }).click();
    await expect(page).toHaveURL("/trusted-adult");
  });

  test("回到首頁連結導航至 /", async ({ page }) => {
    await page.getByRole("button", { name: /回到首頁/ }).click();
    await expect(page).toHaveURL("/");
  });

  test("從首頁完整流程：開始探險 → 選單頁", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /開始探險/ }).click();
    await expect(page).toHaveURL("/menu");
    await expect(page.getByRole("button", { name: /秘密遊戲/ })).toBeVisible();
  });
});
