import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync(new URL("../public/audio/ho3527-temp-free/manifest.json", import.meta.url), "utf8")) as Array<{ identifier: string; transcript: string }>;

async function observeNativeAudio(page: Page) {
  await page.addInitScript(() => {
    const NativeAudio = window.Audio;
    const instances: HTMLAudioElement[] = [];
    Object.defineProperty(window, "__nativeAudio", { value: instances });
    window.Audio = function (src?: string) {
      const audio = new NativeAudio(src);
      audio.addEventListener("playing", () => console.log("NATIVE_PLAYING", audio.src, audio.currentTime));
      audio.addEventListener("error", () => console.log("NATIVE_ERROR", audio.src, audio.error?.message));
      console.log("NATIVE_CREATED", src, audio.src);
      instances.push(audio);
      return audio;
    } as unknown as typeof Audio;
  });
  page.on("console", message => console.log(message.text()));
}

async function nativePlaybackState(page: Page, suffix: string) {
  return page.evaluate((fileSuffix) => {
    const audio = (window as unknown as { __nativeAudio: HTMLAudioElement[] }).__nativeAudio
      .filter(item => item.currentSrc.endsWith(fileSuffix))
      .at(-1);
    return {
      match: Boolean(audio),
      paused: audio?.paused ?? true,
      time: (audio?.currentTime ?? 0) > 0,
      ready: (audio?.readyState ?? 0) >= 2,
      error: audio?.error?.message ?? null,
    };
  }, suffix);
}

test("direct URL keeps manual scenario replay available", async ({ page }) => {
  await observeNativeAudio(page);
  await page.goto("/trusted-adult");

  const replay = page.getByRole("button", { name: "重播情境語音" });
  await expect(replay).toBeVisible();
  await replay.click();
  await expect(replay).toHaveAttribute("data-playing", "true");
  await expect.poll(() => nativePlaybackState(page, "/audio/trust-q1-scenario.mp3"))
    .toMatchObject({ match: true, paused: false, time: true, ready: true, error: null });
});

test("native media: all 20 mappings, captions, mute/replay and five-question completion", async ({ page }) => {
  test.setTimeout(180000);
  await observeNativeAudio(page);
  const pageErrors: string[] = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  await page.goto("/menu");
  await page.getByRole("button", { name: /信任大人/ }).click();
  await expect(page).toHaveURL(/\/trusted-adult$/);
  await expect.poll(() => nativePlaybackState(page, "/audio/trust-q1-scenario.mp3"))
    .toMatchObject({ match: true, paused: false, time: true, ready: true, error: null });
  const correct = [0, 1, 1, 0, 3];
  let offset = 0;
  for (let q = 1; q <= 5; q++) {
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(q));
    await expect(page.getByRole("button", { name: "重播情境語音" })).toHaveAttribute("data-playing", "true");
    const count = q === 5 ? 8 : 3;
    for (let i = 0; i < count; i++) {
      const item = manifest[offset + i];
      await page.getByRole("button", { name: item.transcript, exact: true }).click();
      await expect(page.getByTestId("audio-caption")).toHaveText(item.transcript);
      if (i === 0) {
        for (const viewport of [{ width: 1280, height: 900 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
          await page.setViewportSize(viewport);
          await page.screenshot({ path: `${process.env.HO3527_SCREENSHOTS ?? 'test-results/ho3527-native'}/${viewport.width}x${viewport.height}-q${q}.png`, fullPage: true });
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
          for (const button of await page.getByRole("button").all()) {
            if (!(await button.isVisible())) continue;
            const box = await button.boundingBox();
            expect(box!.width).toBeGreaterThanOrEqual(48);
            expect(box!.height).toBeGreaterThanOrEqual(48);
          }
        }
      }
      await expect.poll(() => page.evaluate((identifier) => {
        const audio = (window as unknown as { __nativeAudio: HTMLAudioElement[] }).__nativeAudio.filter(a => a.src.includes("/ho3527-temp-free/")).at(-1)!;
        return { match: audio.currentSrc.endsWith(`/ho3527-temp-free/${identifier}.mp3`), paused: audio.paused, time: audio.currentTime > 0, ready: audio.readyState >= 2, error: audio.error?.message ?? null, src: audio.currentSrc };
      }, item.identifier)).toMatchObject({ match: true, time: true, ready: true, error: null });
      if (q === 1 && i === 0) {
        await page.getByRole("button", { name: "靜音", exact: true }).click();
        await expect.poll(() => page.evaluate(() => (window as unknown as { __nativeAudio: HTMLAudioElement[] }).__nativeAudio.filter(a => a.src.includes("/ho3527-temp-free/")).at(-1)!.muted)).toBe(true);
        await page.getByRole("button", { name: "重播語音", exact: true }).click();
        await expect.poll(() => page.evaluate(() => { const a = (window as unknown as { __nativeAudio: HTMLAudioElement[] }).__nativeAudio.filter(a => a.src.includes("/ho3527-temp-free/")).at(-1)!; return a.muted && !a.paused && a.currentTime > 0; })).toBe(true);
        await page.getByRole("button", { name: "取消靜音", exact: true }).click();
      }
    }
    await page.getByRole("button", { name: manifest[offset + correct[q - 1]].transcript, exact: true }).click();
    await page.getByRole("button", { name: "確認", exact: true }).click();
    offset += count;
  }
  await expect(page.getByRole("heading", { name: "太棒了！", exact: true })).toBeVisible({ timeout: 30000 });
  expect(offset).toBe(20);
  expect(pageErrors).toEqual([]);
});
