import { test, expect, type Page } from "@playwright/test";
import { bodyPartsV2 } from "../src/data/bodyPartsV2";

// HO-776: 身體紅綠燈 v2 — 觸碰測試互動（語音回應）

async function installAudioSpy(page: Page) {
  await page.addInitScript(() => {
    type MockAudio = {
      src: string;
      preload: string;
      muted: boolean;
      currentTime: number;
      onended: (() => void) | null;
      onerror: (() => void) | null;
      play: () => Promise<void>;
      pause: () => void;
      addEventListener: (name: string, listener: () => void) => void;
      removeEventListener: (name: string, listener: () => void) => void;
      removeAttribute: (name: string) => void;
      load: () => void;
    };

    const state = window as typeof window & { __audioSrcs: string[] };
    state.__audioSrcs = [];
    window.Audio = function AudioMock(src?: string): MockAudio {
      if (src) state.__audioSrcs.push(src);
      return {
        src: src ?? "",
        preload: "",
        muted: false,
        currentTime: 0,
        onended: null,
        onerror: null,
        play: () => Promise.resolve(),
        pause: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        removeAttribute: () => {},
        load: () => {},
      };
    } as unknown as typeof Audio;
  });
}

async function resetAudioSpy(page: Page) {
  await page.evaluate(() => {
    (window as typeof window & { __audioSrcs: string[] }).__audioSrcs = [];
  });
}

async function expectLastAudioSrc(page: Page, expected: string) {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const srcs = (window as typeof window & { __audioSrcs: string[] }).__audioSrcs;
        return srcs.at(-1) ?? "";
      }),
    )
    .toBe(expected);
}

async function setupTouchTest(page: Page, doll: "female" | "male" = "female") {
  await page.goto(`/body-traffic-light/mark?doll=${doll}`);
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
  test("女生頭髮與耳朵標記點對準圖像位置", async ({ page }) => {
    await page.goto("/body-traffic-light/mark?doll=female");

    const hair = page.locator('[data-part-id="head"]').first();
    const ears = page.locator('[data-part-id="ear"]');

    await expect(ears).toHaveCount(2);

    const hairBox = await hair.boundingBox();
    const leftEarBox = await ears.first().boundingBox();
    const rightEarBox = await ears.nth(1).boundingBox();

    expect(hairBox).not.toBeNull();
    expect(leftEarBox).not.toBeNull();
    expect(rightEarBox).not.toBeNull();

    const hairCenterY = hairBox!.y + hairBox!.height / 2;
    const leftEarCenterY = leftEarBox!.y + leftEarBox!.height / 2;
    const rightEarCenterY = rightEarBox!.y + rightEarBox!.height / 2;

    // Hair marker belongs on top hair/bangs, not on the ear/hair-tie row.
    expect(hairCenterY).toBeLessThan(leftEarCenterY - 20);
    expect(hairCenterY).toBeLessThan(rightEarCenterY - 20);
  });
  // Store is in-memory (no persist). page.goto() always reloads the page and
  // resets the store to empty, so only the empty-store path is E2E-testable.
  // The guard uses < bodyPartsV2.length (not === 0) for forward-compatibility
  // if persist is added later.
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

  test("US5: 點擊綠燈標記部位 → 也會觸發語音回應", async ({ page }) => {
    // setupTouchTest marks all parts green except private (red).
    // Asserting a non-red part triggers data-playing catches a class of
    // regression where AUDIO_MAP[color] lookup early-returns for any
    // non-red color (or hardcodes red).
    await setupTouchTest(page);
    await page.locator('[data-part-id="hand"]').first().click();
    await expect(page.getByTestId("touch-test-page")).toHaveAttribute(
      "data-playing",
      "hand",
    );
  });

  test("US6: 女生人偶使用小女生語音、男生人偶使用小男生語音", async ({
    page,
  }) => {
    await installAudioSpy(page);

    await setupTouchTest(page, "female");
    await resetAudioSpy(page);
    await page.locator('[data-part-id="private"]').first().click();
    await expectLastAudioSrc(page, "/audio/female-red-response.mp3");

    await setupTouchTest(page, "male");
    await resetAudioSpy(page);
    await page.locator('[data-part-id="private"]').first().click();
    await expectLastAudioSrc(page, "/audio/male-red-response.mp3");
  });
});
