import { test, expect } from "@playwright/test";

test.describe("首頁 (HO-606)", () => {
  test("顯示標題、角色區域、開始按鈕", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "保護自己大冒險" })).toBeVisible();
    await expect(page.getByRole("button", { name: /開始探險/ })).toBeVisible();
    await expect(page.getByRole("img", { name: "男生人偶頭像" })).toBeVisible();
    await expect(page.getByRole("img", { name: "女生人偶頭像" })).toBeVisible();
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

  test("首頁 hero 在桌機分欄、手機堆疊且保留暖色視覺", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.evaluate(async () => {
        await document.fonts.ready;
      });

      const hero = page.getByTestId("homepage-hero");
      const intro = page.getByTestId("homepage-intro");
      const characters = page.getByTestId("homepage-characters");
      const maleAvatar = page.getByTestId("homepage-avatar-male").locator("img");
      const femaleAvatar = page.getByTestId("homepage-avatar-female").locator("img");
      const action = page.getByTestId("homepage-start");
      const titleLine1 = page.getByTestId("homepage-title-line-1");
      const titleLine2 = page.getByTestId("homepage-title-line-2");
      await expect(hero).toBeVisible();
      await expect(page.getByRole("heading", { name: "保護自己大冒險" })).toBeVisible();
      await expect(titleLine1).toHaveText("保護自己");
      await expect(titleLine2).toHaveText("大冒險");
      await expect(maleAvatar).toHaveAttribute("src", "/images/紅綠燈難.png");
      await expect(femaleAvatar).toHaveAttribute("src", "/images/紅綠燈女.png");
      await expect(maleAvatar).toHaveJSProperty("naturalWidth", 1024);
      await expect(femaleAvatar).toHaveJSProperty("naturalWidth", 1024);
      await expect(maleAvatar).toHaveCSS("object-fit", "cover");
      await expect(femaleAvatar).toHaveCSS("object-fit", "cover");
      await expect(maleAvatar).toHaveCSS("object-position", "50% 0%");
      await expect(femaleAvatar).toHaveCSS("object-position", "50% 0%");
      await expect(action).toBeInViewport();
      await expect(page.getByRole("button", { name: "靜音" })).toBeVisible();

      const layout = await page.evaluate(() => {
        const rect = (testId: string) => {
          const element = document.querySelector(`[data-testid="${testId}"]`);
          if (!element) return null;
          const { x, y, width, height } = element.getBoundingClientRect();
          return { x, y, width, height };
        };
        return {
          viewportWidth: window.innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          intro: rect("homepage-intro"),
          titleLine1: rect("homepage-title-line-1"),
          titleLine2: rect("homepage-title-line-2"),
          characters: rect("homepage-characters"),
          action: rect("homepage-start"),
          charactersBackground: getComputedStyle(
            document.querySelector('[data-testid="homepage-characters"]')!,
          ).backgroundColor,
          actionBackground: getComputedStyle(
            document.querySelector('[data-testid="homepage-start"]')!,
          ).backgroundColor,
          muteOverlapsAction: (() => {
            const action = document.querySelector('[data-testid="homepage-start"]')?.getBoundingClientRect();
            const mute = document.querySelector('button[aria-label]')?.getBoundingClientRect();
            return Boolean(
              action && mute && action.left < mute.right && action.right > mute.left &&
              action.top < mute.bottom && action.bottom > mute.top,
            );
          })(),
        };
      });

      expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
      expect(layout.charactersBackground).toBe("rgb(255, 245, 225)");
      expect(layout.actionBackground).toBe("rgb(255, 159, 67)");
      expect(layout.muteOverlapsAction).toBe(false);
      expect(layout.titleLine2!.y).toBeGreaterThan(layout.titleLine1!.y);
      expect(await intro.count()).toBe(1);
      expect(await characters.count()).toBe(1);

      if (viewport.width >= 768) {
        expect(layout.characters!.x).toBeGreaterThan(layout.intro!.x);
      } else {
        expect(layout.intro!.y).toBeLessThan(layout.characters!.y);
        expect(layout.characters!.y).toBeLessThan(layout.action!.y);
      }
    }
  });
});
