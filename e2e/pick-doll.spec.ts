import { test, expect } from "@playwright/test";

// HO-774: 身體紅綠燈 v2 — 人偶選擇頁

test.describe("人偶選擇頁 (HO-774)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/body-traffic-light/pick-doll");
  });

  test("頁面載入顯示標題與兩張人偶卡", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "選一個你喜歡的人偶" })).toBeVisible();
    await expect(page.getByTestId("doll-card-female")).toBeVisible();
    await expect(page.getByTestId("doll-card-male")).toBeVisible();
  });

  test("兩張人偶卡都載入客戶 PNG", async ({ page }) => {
    await expect(page.getByTestId("doll-card-female").locator("img")).toHaveAttribute(
      "src",
      "/images/紅綠燈女.png",
    );
    await expect(page.getByTestId("doll-card-male").locator("img")).toHaveAttribute(
      "src",
      "/images/紅綠燈難.png",
    );
  });

  test("兩張人偶圖使用 clean portrait canvas 而非舊 infographic canvas", async ({ page }) => {
    for (const id of ["doll-card-female", "doll-card-male"]) {
      const image = page.getByTestId(id).locator("img");
      await expect(image).toHaveJSProperty("naturalWidth", 1024);
      await expect(image).toHaveJSProperty("naturalHeight", 1705);
    }
  });

  test("未選擇時「選好了」按鈕為 disabled", async ({ page }) => {
    const btn = page.getByTestId("confirm-btn");
    await expect(btn).toBeDisabled();
  });

  test("點選女生卡片後按鈕變為可點擊", async ({ page }) => {
    await page.getByTestId("doll-card-female").click();
    await expect(page.getByTestId("confirm-btn")).toBeEnabled();
  });

  test("點選男生卡片後按鈕變為可點擊", async ({ page }) => {
    await page.getByTestId("doll-card-male").click();
    await expect(page.getByTestId("confirm-btn")).toBeEnabled();
  });

  test("點選女生後「選好了」導向 mark?doll=female", async ({ page }) => {
    await page.getByTestId("doll-card-female").click();
    await page.getByTestId("confirm-btn").click();
    await expect(page).toHaveURL("/body-traffic-light/mark?doll=female");
  });

  test("點選男生後「選好了」導向 mark?doll=male", async ({ page }) => {
    await page.getByTestId("doll-card-male").click();
    await page.getByTestId("confirm-btn").click();
    await expect(page).toHaveURL("/body-traffic-light/mark?doll=male");
  });

  test("切換選擇：先選女生再點男生，男生變為選中", async ({ page }) => {
    await page.getByTestId("doll-card-female").click();
    await page.getByTestId("doll-card-male").click();

    // aria-pressed reflects selected state
    await expect(page.getByTestId("doll-card-male")).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("doll-card-female")).toHaveAttribute("aria-pressed", "false");
  });
});
