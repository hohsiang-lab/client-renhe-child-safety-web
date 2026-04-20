import { test, expect, type Page } from "@playwright/test";
import { bodyPartsV2 } from "../src/data/bodyPartsV2";

// HO-776: 身體紅綠燈 v2 — 觸碰測試互動（語音回應）

async function setupTouchTest(page: Page) {
  await page.goto("/body-traffic-light/mark?doll=female");
  for (const part of bodyPartsV2) {
    // dispatchEvent bypasses browser hit-testing; required for parts whose click
    // zones overlap a higher-z-order zone (e.g. head ↔ face).
    await page.locator(`[data-part-id="${part.id}"]`).first().dispatchEvent("click");
    await page.getByRole("button", { name: /綠燈/ }).click();
  }
  // Override private → red to test color-specific audio trigger
  await page.locator('[data-part-id="private"]').first().dispatchEvent("click");
  await page.getByRole("button", { name: /紅燈/ }).click();
  await page.getByTestId("complete-btn").click();
  await expect(page).toHaveURL("/body-traffic-light/touch-test");
}

test.describe("觸碰測試頁 (HO-776)", () => {
  test("直接瀏覽 /touch-test（store 為空）→ 重導向 /body-traffic-light/mark", async ({
    page,
  }) => {
    await page.goto("/body-traffic-light/touch-test");
    await expect(page).toHaveURL("/body-traffic-light/mark");
  });


  test("US1: 點擊部位 → data-playing 屬性更新", async ({ page }) => {
    await setupTouchTest(page);
    await page.locator('[data-part-id="private"]').first().click();
    await expect(page.getByTestId("touch-test-page")).toHaveAttribute(
      "data-playing",
      "private",
    );
  });

  test("US2: 「我學會了！」→ 導向 /ending", async ({ page }) => {
    await setupTouchTest(page);
    await page.getByTestId("done-btn").click();
    await expect(page).toHaveURL("/ending");
  });

  test("US3: BodyMarkPage 完成設定 → /body-traffic-light/touch-test", async ({
    page,
  }) => {
    await page.goto("/body-traffic-light/mark?doll=female");
    for (const part of bodyPartsV2) {
      await page.locator(`[data-part-id="${part.id}"]`).first().dispatchEvent("click");
      await page.getByRole("button", { name: /綠燈/ }).click();
    }
    await page.getByTestId("complete-btn").click();
    await expect(page).toHaveURL("/body-traffic-light/touch-test");
  });

  test("US4: 重複點擊同一部位可再次觸發", async ({ page }) => {
    await setupTouchTest(page);
    const pageEl = page.getByTestId("touch-test-page");
    await page.locator('[data-part-id="private"]').first().click();
    await expect(pageEl).toHaveAttribute("data-playing", "private");
    await page.locator('[data-part-id="private"]').first().click();
    await expect(pageEl).toHaveAttribute("data-playing", "private");
  });
});
