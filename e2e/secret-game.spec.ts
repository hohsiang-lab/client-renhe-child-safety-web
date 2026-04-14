import { test, expect } from "@playwright/test";

test.describe("秘密遊戲 (HO-608)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/secret-game");
  });

  test("顯示第 1 題情境、進度、兩個答案按鈕", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /秘密遊戲/ })).toBeVisible();
    await expect(page.getByText(/第 1 \/ 6 題/)).toBeVisible();
    await expect(page.getByRole("button", { name: /好秘密/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /壞秘密/ })).toBeVisible();
  });

  test("答對顯示星星動畫，2 秒後自動進下一題", async ({ page }) => {
    const scenario = await page.locator("p.text-lg.leading-relaxed").textContent();

    const goodBtn = page.getByRole("button", { name: /好秘密/ });
    const badBtn = page.getByRole("button", { name: /壞秘密/ });

    const goodSecrets = [
      "媽媽生日快到了",
      "聖誕節你和同學一起準備卡片",
      "你做了一個手工禮物",
    ];
    const isGood = goodSecrets.some((s) => scenario?.includes(s));

    if (isGood) {
      await goodBtn.click();
    } else {
      await badBtn.click();
    }

    await expect(page.getByText("答對了！好棒！")).toBeVisible();
    await expect(page.getByText("⭐")).toBeVisible();

    await expect(page.getByText(/第 2 \/ 6 題/)).toBeVisible({ timeout: 5000 });
  });

  test("答錯顯示解說 + 我知道了按鈕", async ({ page }) => {
    const scenario = await page.locator("p.text-lg.leading-relaxed").textContent();

    const goodBtn = page.getByRole("button", { name: /好秘密/ });
    const badBtn = page.getByRole("button", { name: /壞秘密/ });

    const goodSecrets = [
      "媽媽生日快到了",
      "聖誕節你和同學一起準備卡片",
      "你做了一個手工禮物",
    ];
    const isGood = goodSecrets.some((s) => scenario?.includes(s));

    if (isGood) {
      await badBtn.click();
    } else {
      await goodBtn.click();
    }

    await expect(page.getByText("不太對喔～")).toBeVisible();
    await expect(page.getByRole("button", { name: "我知道了" })).toBeVisible();

    await page.getByRole("button", { name: "我知道了" }).click();
    await expect(page.getByText(/第 2 \/ 6 題/)).toBeVisible();
  });

  test("完成 6 題後顯示分數並可導向結尾頁", async ({ page }) => {
    const goodSecrets = [
      "媽媽生日快到了",
      "聖誕節你和同學一起準備卡片",
      "你做了一個手工禮物",
    ];

    for (let i = 0; i < 6; i++) {
      const scenario = await page.locator("p.text-lg.leading-relaxed").textContent();
      const isGood = goodSecrets.some((s) => scenario?.includes(s));

      if (isGood) {
        await page.getByRole("button", { name: /好秘密/ }).click();
      } else {
        await page.getByRole("button", { name: /壞秘密/ }).click();
      }

      const correct = await page.getByText("答對了！好棒！").isVisible().catch(() => false);
      if (correct) {
        await page.waitForTimeout(2500);
      } else {
        await page.getByRole("button", { name: "我知道了" }).click();
      }
    }

    await expect(page.getByText("遊戲完成！")).toBeVisible();
    await expect(page.getByText(/你答對了/)).toBeVisible();
    await expect(page.getByText(/\/ 6 題/)).toBeVisible();

    await page.getByRole("button", { name: "完成" }).click();
    await expect(page).toHaveURL("/ending");
  });

  test("全部答對顯示 6/6", async ({ page }) => {
    const goodSecrets = [
      "媽媽生日快到了",
      "聖誕節你和同學一起準備卡片",
      "你做了一個手工禮物",
    ];

    for (let i = 0; i < 6; i++) {
      await expect(page.getByRole("button", { name: /好秘密/ })).toBeVisible({ timeout: 5000 });
      const scenario = await page.locator("p.text-lg.leading-relaxed").textContent();
      const isGood = goodSecrets.some((s) => scenario?.includes(s));

      if (isGood) {
        await page.getByRole("button", { name: /好秘密/ }).click();
      } else {
        await page.getByRole("button", { name: /壞秘密/ }).click();
      }

      await expect(page.getByText("答對了！好棒！")).toBeVisible({ timeout: 5000 });

      if (i < 5) {
        await expect(page.getByText(new RegExp(`第 ${i + 2} \\/ 6 題`))).toBeVisible({ timeout: 5000 });
      }
    }

    await expect(page.getByText("遊戲完成！")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("太厲害了，全部答對！")).toBeVisible();
  });

  test("答案按鈕觸控目標 ≥ 48px", async ({ page }) => {
    const goodBtn = page.getByRole("button", { name: /好秘密/ });
    const badBtn = page.getByRole("button", { name: /壞秘密/ });

    const goodBox = await goodBtn.boundingBox();
    const badBox = await badBtn.boundingBox();

    expect(goodBox).not.toBeNull();
    expect(goodBox!.height).toBeGreaterThanOrEqual(48);
    expect(goodBox!.width).toBeGreaterThanOrEqual(48);

    expect(badBox).not.toBeNull();
    expect(badBox!.height).toBeGreaterThanOrEqual(48);
    expect(badBox!.width).toBeGreaterThanOrEqual(48);
  });

  test("從選單完整流程：選單 → 秘密遊戲", async ({ page }) => {
    await page.goto("/menu");
    await page.getByRole("button", { name: /秘密遊戲/ }).click();
    await expect(page).toHaveURL("/secret-game");
    await expect(page.getByRole("heading", { name: /秘密遊戲/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /好秘密/ })).toBeVisible();
  });
});
