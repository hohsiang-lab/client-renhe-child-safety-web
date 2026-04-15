import { test, expect } from "@playwright/test";

test.describe("身體紅綠燈 (HO-609)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/body-traffic-light");
  });

  test("顯示標題、引導文字、SVG 人形", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /身體紅綠燈/ }),
    ).toBeVisible();
    await expect(page.getByText(/點擊身體部位/)).toBeVisible();
    await expect(page.locator("svg")).toBeVisible();
    await expect(page.getByText(/已探索 0 \/ 6/)).toBeVisible();
  });

  test("點擊綠燈部位顯示綠色回饋 + 說明", async ({ page }) => {
    const headGroup = page.locator('svg g[aria-label="頭 / 頭髮"]');
    await headGroup.click();

    await expect(page.getByText("🟢")).toBeVisible();
    await expect(page.getByText("頭 / 頭髮")).toBeVisible();
    await expect(page.getByText(/別人可以摸你的頭/)).toBeVisible();
    await expect(page.getByText(/已探索 1 \/ 6/)).toBeVisible();
  });

  test("點擊紅燈部位顯示紅色回饋 + 說明", async ({ page }) => {
    const chestGroup = page.locator('svg g[aria-label="胸部"]');
    await chestGroup.click();

    await expect(page.getByText("🔴")).toBeVisible();
    await expect(page.getByText("胸部")).toBeVisible();
    await expect(page.getByText(/私密的地方/)).toBeVisible();
  });

  test("切換部位時更新資訊面板", async ({ page }) => {
    const headGroup = page.locator('svg g[aria-label="頭 / 頭髮"]');
    await headGroup.click();
    await expect(page.getByText("🟢")).toBeVisible();

    const chestGroup = page.locator('svg g[aria-label="胸部"]');
    await chestGroup.click();
    await expect(page.getByText("🔴")).toBeVisible();
    await expect(page.getByText("胸部")).toBeVisible();
  });

  test("重複點擊同一部位不重複計數", async ({ page }) => {
    const headGroup = page.locator('svg g[aria-label="頭 / 頭髮"]');
    await headGroup.click();
    await expect(page.getByText(/已探索 1 \/ 6/)).toBeVisible();

    await headGroup.click();
    await expect(page.getByText(/已探索 1 \/ 6/)).toBeVisible();
  });

  test("探索全部 6 部位後顯示完成畫面並跳轉 /menu", async ({ page }) => {
    const parts = [
      "頭 / 頭髮",
      "胸部",
      "手",
      "私密處",
      "腿",
      "腳",
    ];

    for (let i = 0; i < parts.length; i++) {
      const group = page.locator(`svg g[aria-label="${parts[i]}"]`);
      await group.locator("rect, circle").first().click();
      await expect(
        page.getByText(new RegExp(`已探索 ${i + 1} \\/ 6`)),
      ).toBeVisible();
    }

    await expect(page.getByText("太棒了！")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/6 個部位/)).toBeVisible();
    await expect(page.getByText(/紅燈的地方是私密部位/)).toBeVisible();

    await page.getByRole("button", { name: /回到選單/ }).click();
    await expect(page).toHaveURL("/menu");
  });

  test("SVG 部位觸控目標 ≥ 48px", async ({ page }) => {
    const headGroup = page.locator('svg g[aria-label="頭 / 頭髮"]');
    const box = await headGroup.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(48);
    expect(box!.width).toBeGreaterThanOrEqual(48);
  });

  test("鍵盤 Tab + Enter 可選取部位", async ({ page }) => {
    const headGroup = page.locator('svg g[aria-label="頭 / 頭髮"]');
    await headGroup.focus();
    await page.keyboard.press("Enter");

    await expect(page.getByText("頭 / 頭髮")).toBeVisible();
    await expect(page.getByText(/已探索 1 \/ 6/)).toBeVisible();

    const chestGroup = page.locator('svg g[aria-label="胸部"]');
    await chestGroup.focus();
    await page.keyboard.press(" ");

    await expect(page.getByText("胸部")).toBeVisible();
    await expect(page.getByText(/已探索 2 \/ 6/)).toBeVisible();
  });

  test("從選單進入身體紅綠燈", async ({ page }) => {
    await page.goto("/menu");
    await page.getByRole("button", { name: /身體紅綠燈/ }).click();
    await expect(page).toHaveURL("/body-traffic-light");
    await expect(
      page.getByRole("heading", { name: /身體紅綠燈/ }),
    ).toBeVisible();
  });
});
