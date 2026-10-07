import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Real media/events, accelerated only to keep the focused check short.
  await page.addInitScript(() => {
    const NativeAudio = window.Audio;
    window.Audio = class extends NativeAudio {
      constructor(src?: string) {
        super(src);
        this.playbackRate = 8;
        this.addEventListener("ended", () => console.debug(`audio-ended:${src}`));
        this.addEventListener("error", () => console.debug(`audio-error:${src}`));
      }
    };
  });
});

test("Q1 correct audio 404 advances exactly once to Q2", async ({ page }) => {
  let failures = 0;
  const scenarios: string[] = [];
  page.on("request", (request) => {
    if (/trust-q\d-scenario\.mp3/.test(request.url())) scenarios.push(request.url());
  });
  await page.route("**/audio/trust-q1-correct.mp3", async (route) => {
    failures++;
    await route.fulfill({ status: 404, contentType: "text/plain", body: "missing" });
  });
  await page.goto("/trusted-adult");
  await page.getByRole("button", { name: "告訴一位你覺得安全、願意聽你說的大人", exact: true }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
  await expect(page.getByText("放學路上有陌生人一直跟著你，你該怎麼辦？", { exact: true })).toBeVisible();
  // Let both native error and rejected-play delivery settle, not just the first frame.
  await page.waitForTimeout(500);
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
  expect(failures).toBe(1);
  expect(scenarios.some((src) => src.includes("trust-q2-scenario.mp3"))).toBe(true);
  expect(scenarios.some((src) => src.includes("trust-q3-scenario.mp3"))).toBe(false);
});

test("successful Q1–Q5 audio advances once per answer", async ({ page }) => {
  test.setTimeout(90000);
  const responses: number[] = [];
  const endings: string[] = [];
  const errors: string[] = [];
  page.on("console", (message) => {
    if (/^audio-ended:.*trust-q\d-correct\.mp3$/.test(message.text())) endings.push(message.text());
    if (/^audio-error:.*trust-q\d-correct\.mp3$/.test(message.text())) errors.push(message.text());
  });
  page.on("response", (response) => {
    if (/trust-q\d-correct\.mp3/.test(response.url())) responses.push(response.status());
  });
  await page.goto("/trusted-adult");
  const answers = [
    "告訴一位你覺得安全、願意聽你說的大人",
    "趕快到附近商店，向店員或你覺得安全的人求助",
    "告訴一位你覺得安全、願意聽你說的大人",
    "113",
    "媽媽",
  ];
  for (const [index, answer] of answers.entries()) {
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(index + 1));
    await page.getByRole("button", { name: answer, exact: true }).click();
    if (index < 4) {
      await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(index + 2), { timeout: 20000 });
    }
  }
  await expect(page.getByRole("heading", { name: "太棒了！", exact: true })).toBeVisible({ timeout: 20000 });
  await expect(page.getByText("已答題 5 題", { exact: true })).toBeVisible();
  expect(endings).toEqual(answers.map((_, index) => `audio-ended:/audio/trust-q${index + 1}-correct.mp3`));
  expect(errors).toEqual([]);
  expect(responses).toHaveLength(5);
  expect(responses.every((status) => status === 200 || status === 206)).toBe(true);
});
