import { test, expect } from "@playwright/test";
import { bodyPartsV2 } from "../src/data/bodyPartsV2";

// HO-775: 身體紅綠燈 v2 — 身體標記互動頁

test.describe("身體標記頁 (HO-775)", () => {
  test("?doll=female → 顯示 doll-female.png", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=female");
    const src = await page.getByTestId("doll-image").getAttribute("src");
    expect(src).toContain("doll-female.png");
  });

  test("?doll=male → 顯示 doll-male.png", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=male");
    const src = await page.getByTestId("doll-image").getAttribute("src");
    expect(src).toContain("doll-male.png");
  });

  test("無 param → fallback 顯示 doll-female.png", async ({ page }) => {
    await page.goto("/body-traffic-light/mark");
    const src = await page.getByTestId("doll-image").getAttribute("src");
    expect(src).toContain("doll-female.png");
  });

  test("?doll=alien → fallback 顯示 doll-female.png", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=alien");
    const src = await page.getByTestId("doll-image").getAttribute("src");
    expect(src).toContain("doll-female.png");
  });

  test("點擊「私密處」hit area → 顯示已選部位名稱", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=female");
    await page.getByRole("button", { name: "私密處" }).first().click();
    await expect(page.getByText("私密處", { exact: false })).toBeVisible();
  });

  test("選中部位後點🔴 → data-color 屬性變為 red", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=female");
    await page.getByRole("button", { name: "私密處" }).first().click();
    await page.getByRole("button", { name: /紅燈/ }).click();
    const btn = page.getByRole("button", { name: "私密處" }).first();
    await expect(btn).toHaveAttribute("data-color", "red");
  });

  test("選部位互斥 — 點 B 後 A 應取消選中", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=female");
    await page.getByRole("button", { name: "私密處" }).first().click();
    await expect(
      page.getByRole("button", { name: "私密處" }).first()
    ).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "肚子" }).first().click();
    await expect(
      page.getByRole("button", { name: "私密處" }).first()
    ).toHaveAttribute("aria-pressed", "false");
    await expect(
      page.getByRole("button", { name: "肚子" }).first()
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("重新修改燈色 — 綠燈改為黃燈", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=female");
    await page.getByRole("button", { name: "私密處" }).first().click();
    await page.getByRole("button", { name: /綠燈/ }).click();
    await expect(
      page.getByRole("button", { name: "私密處" }).first()
    ).toHaveAttribute("data-color", "green");

    await page.getByRole("button", { name: "私密處" }).first().click();
    await page.getByRole("button", { name: /黃燈/ }).click();
    await expect(
      page.getByRole("button", { name: "私密處" }).first()
    ).toHaveAttribute("data-color", "yellow");
  });

  test("標記全部 10 個部位 → 「完成設定」按鈕出現", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=female");

    for (const part of bodyPartsV2) {
      await page.getByRole("button", { name: part.name }).first().click();
      await page.getByRole("button", { name: /綠燈/ }).click();
    }

    await expect(page.getByTestId("complete-btn")).toBeVisible();
  });

  test("完成後仍可修改 — 「完成設定」維持可見", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=female");

    for (const part of bodyPartsV2) {
      await page.getByRole("button", { name: part.name }).first().click();
      await page.getByRole("button", { name: /綠燈/ }).click();
    }

    await expect(page.getByTestId("complete-btn")).toBeVisible();

    // 修改其中一個部位
    await page.getByRole("button", { name: "私密處" }).first().click();
    await page.getByRole("button", { name: /紅燈/ }).click();
    await expect(
      page.getByRole("button", { name: "私密處" }).first()
    ).toHaveAttribute("data-color", "red");
    await expect(page.getByTestId("complete-btn")).toBeVisible();
  });

  test("9 個部位標記時「完成設定」不出現", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=female");

    for (const part of bodyPartsV2.slice(0, 9)) {
      await page.getByRole("button", { name: part.name }).first().click();
      await page.getByRole("button", { name: /綠燈/ }).click();
    }

    await expect(page.getByTestId("complete-btn")).not.toBeVisible();
  });

  test("點「完成設定」→ URL 導向 /body-traffic-light/touch-test", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=female");

    for (const part of bodyPartsV2) {
      await page.getByRole("button", { name: part.name }).first().click();
      await page.getByRole("button", { name: /綠燈/ }).click();
    }

    await page.getByTestId("complete-btn").click();
    await expect(page).toHaveURL("/body-traffic-light/touch-test");
>>>>>>> origin/HO-775-btl-v2-body-mark
  });
});
