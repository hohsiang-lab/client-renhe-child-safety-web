import { expect, test, type Page } from "@playwright/test";

async function installImmediateAudio(page: Page) {
  await page.addInitScript(() => {
    const audioEvents: Array<{ src: string; muted: boolean }> = [];
    Object.defineProperty(window, "__audioEvents", {
      configurable: true,
      value: audioEvents,
    });

    class ImmediateAudio {
      src: string;
      currentTime = 0;
      muted = false;
      paused = true;
      onended: (() => void) | null = null;
      onplaying: (() => void) | null = null;
      onerror: (() => void) | null = null;

      constructor(src = "") {
        this.src = src;
      }

      getAttribute(name: string) {
        return name === "src" ? this.src : null;
      }

      removeAttribute(name: string) {
        if (name === "src") this.src = "";
      }

      load() {}

      pause() {
        this.paused = true;
      }

      play() {
        this.paused = false;
        audioEvents.push({ src: this.src, muted: this.muted });
        this.onplaying?.();
        this.paused = true;
        this.onended?.();
        return Promise.resolve();
      }
    }

    Object.defineProperty(window, "Audio", {
      configurable: true,
      value: ImmediateAudio,
    });
  });
}

async function lastRecordedAudioPlay(page: Page) {
  return page.evaluate(() => {
    const events = (window as unknown as {
      __audioEvents: Array<{ src: string; muted: boolean }>;
    }).__audioEvents;
    return events.filter((event) => event.src).at(-1) ?? null;
  });
}

async function completeAllQuestions(page: Page) {
  const correctAnswers = [
    "告訴一位你覺得安全、願意聽你說的大人",
    "趕快到附近商店，向店員或你覺得安全的人求助",
    "告訴一位你覺得安全、願意聽你說的大人",
    "113",
  ];
  const progress = page.getByRole("progressbar", { name: "信任大人答題進度" });
  const confirm = page.getByRole("button", { name: "確認" });

  for (const [i, answerText] of correctAnswers.entries()) {
    await expect(progress).toHaveAttribute("aria-valuenow", String(i + 1));
    const answer = page.getByRole("button", { name: answerText });
    await answer.click();
    await expect(answer).toHaveAttribute("aria-pressed", "true");
    await confirm.click();
    await expect(progress).toHaveAttribute("aria-valuenow", String(i + 2));
  }

  const trustedAdult = page.getByRole("button", { name: "老師" });
  await trustedAdult.click();
  await expect(trustedAdult).toHaveAttribute("aria-pressed", "true");
  await confirm.click();
  await expect(page.getByRole("heading", { name: "太棒了！" })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await installImmediateAudio(page);
  await page.goto("/trusted-adult");
});

test("題卡播放控制提供播放／播放中 icon", async ({ page }) => {
  const playback = page.getByRole("button", { name: "重播情境語音" });
  await expect(playback.locator("svg")).toHaveCount(1);
  await expect(playback).toHaveAttribute("data-playing", "false");
});

test("選項字幕與重播控制顯示在題卡內", async ({ page }) => {
  const questionText = "有人在學校對你做了不舒服的事，你應該告訴誰？";
  const questionCard = page.getByText(questionText, { exact: true }).locator("xpath=..");

  await page.getByRole("button", { name: "自己忍耐", exact: true }).click();

  const caption = questionCard.getByRole("complementary", { name: "語音字幕" });
  await expect(caption).toBeVisible();
  await expect(caption.getByTestId("audio-caption")).toHaveText("自己忍耐");
  await expect(caption.getByRole("button", { name: "重播語音" })).toBeVisible();
  await expect(page.getByRole("complementary", { name: "語音字幕" })).toHaveCount(1);
});

test("20 個選項朗讀各自的靜態 MP3，並沿用字幕、靜音與重播", async ({ page }) => {
  const groups = [
    {
      id: 1,
      choices: [
        { label: "告訴一位你覺得安全、願意聽你說的大人", src: "/audio/ho3527-temp-free/trust-q1-option-1.mp3" },
        { label: "自己忍耐", src: "/audio/ho3527-temp-free/trust-q1-option-2.mp3" },
        { label: "那個人的朋友", src: "/audio/ho3527-temp-free/trust-q1-option-3.mp3" },
      ],
      correct: "告訴一位你覺得安全、願意聽你說的大人",
    },
    {
      id: 2,
      choices: [
        { label: "跟他走", src: "/audio/ho3527-temp-free/trust-q2-option-1.mp3" },
        { label: "趕快到附近商店，向店員或你覺得安全的人求助", src: "/audio/ho3527-temp-free/trust-q2-option-2.mp3" },
        { label: "假裝沒看到", src: "/audio/ho3527-temp-free/trust-q2-option-3.mp3" },
      ],
      correct: "趕快到附近商店，向店員或你覺得安全的人求助",
    },
    {
      id: 3,
      choices: [
        { label: "乖乖保密", src: "/audio/ho3527-temp-free/trust-q3-option-1.mp3" },
        { label: "告訴一位你覺得安全、願意聽你說的大人", src: "/audio/ho3527-temp-free/trust-q3-option-2.mp3" },
        { label: "不理他就好", src: "/audio/ho3527-temp-free/trust-q3-option-3.mp3" },
      ],
      correct: "告訴一位你覺得安全、願意聽你說的大人",
    },
    {
      id: 4,
      choices: [
        { label: "113", src: "/audio/ho3527-temp-free/trust-q4-option-1.mp3" },
        { label: "隨便一個號碼", src: "/audio/ho3527-temp-free/trust-q4-option-2.mp3" },
        { label: "不知道", src: "/audio/ho3527-temp-free/trust-q4-option-3.mp3" },
      ],
      correct: "113",
    },
    {
      id: 5,
      choices: [
        { label: "媽媽", src: "/audio/ho3527-temp-free/trust-q5-role-mom.mp3" },
        { label: "爸爸", src: "/audio/ho3527-temp-free/trust-q5-role-dad.mp3" },
        { label: "奶奶", src: "/audio/ho3527-temp-free/trust-q5-role-grandma.mp3" },
        { label: "老師", src: "/audio/ho3527-temp-free/trust-q5-role-teacher.mp3" },
        { label: "警察", src: "/audio/ho3527-temp-free/trust-q5-role-police.mp3" },
        { label: "親戚", src: "/audio/ho3527-temp-free/trust-q5-role-relatives.mp3" },
        { label: "隔壁叔叔阿姨", src: "/audio/ho3527-temp-free/trust-q5-role-neighbors.mp3" },
        { label: "媽媽的男朋友", src: "/audio/ho3527-temp-free/trust-q5-role-moms-boyfriend.mp3" },
      ],
      correct: "老師",
    },
  ];
  const progress = page.getByRole("progressbar", { name: "信任大人答題進度" });
  const confirm = page.getByRole("button", { name: "確認" });

  await page.getByRole("button", { name: "靜音" }).click();
  await expect(page.getByRole("button", { name: "取消靜音" })).toBeVisible();

  for (const group of groups) {
    await expect(progress).toHaveAttribute("aria-valuenow", String(group.id));
    for (const [choiceIndex, choice] of group.choices.entries()) {
      const assetResponse = await page.context().request.get(
        new URL(choice.src, page.url()).toString(),
      );
      expect(assetResponse.status()).toBe(200);
      expect(assetResponse.headers()["content-type"]).toMatch(/^audio\/mpeg/);
      const option = page.getByRole("button", { name: choice.label, exact: true });
      await option.click();
      await expect(option).toHaveAttribute("aria-pressed", "true");
      const isFirstMutedChoice = group.id === 1 && choiceIndex === 0;
      expect(await lastRecordedAudioPlay(page)).toEqual({
        src: choice.src,
        muted: isFirstMutedChoice,
      });
      await expect(page.getByTestId("audio-caption")).toHaveText(choice.label);

      if (isFirstMutedChoice) {
        await page.getByRole("button", { name: "重播語音" }).click();
        expect(await lastRecordedAudioPlay(page)).toEqual({
          src: choice.src,
          muted: true,
        });
        await page.getByRole("button", { name: "取消靜音" }).click();
        await expect(page.getByRole("button", { name: "靜音" })).toBeVisible();
      }
    }

    await page.getByRole("button", { name: group.correct, exact: true }).click();
    await confirm.click();
    if (group.id < 5) {
      await expect(progress).toHaveAttribute("aria-valuenow", String(group.id + 1));
    } else {
      await expect(page.getByRole("heading", { name: "太棒了！" })).toBeVisible();
    }
  }
});

test("選取答案後才啟用確認，確認之前不判題", async ({ page }) => {
  const confirm = page.getByRole("button", { name: "確認" });
  await expect(confirm).toBeDisabled();

  const wrongAnswer = page.getByRole("button", { name: "自己忍耐" });
  await wrongAnswer.click();
  await expect(wrongAnswer).toHaveAttribute("aria-pressed", "true");
  await expect(wrongAnswer).toContainText("✓");
  await expect(confirm).toBeEnabled();
  await expect(page.getByText("再想想看喔～", { exact: true })).toHaveCount(0);

  await confirm.click();
  await expect(page.getByText("再想想看喔～")).toBeVisible();
  await expect(wrongAnswer).toBeDisabled();

  await page.getByRole("button", { name: "再試一次" }).click();
  await expect(confirm).toBeDisabled();
  await expect(wrongAnswer).toHaveAttribute("aria-pressed", "false");
});

test("五題確認後保留完成摘要與重玩流程", async ({ page }) => {
  await completeAllQuestions(page);
  await expect(page.getByText("已答題 5 題")).toBeVisible();
  await expect(page.getByText("答對 4 題")).toBeVisible();
  await expect(page.getByText("求助對象選擇不列入答對題數")).toBeVisible();

  await page.getByRole("button", { name: "再玩一次" }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  await expect(page.getByRole("button", { name: "確認" })).toBeDisabled();
});

test("完成五題後可回到主選單", async ({ page }) => {
  await completeAllQuestions(page);
  await page.getByRole("button", { name: "回到主選單" }).click();
  await expect(page).toHaveURL(/\/menu$/);
});

test("選項可用鍵盤確認並保有焦點提示與 48px 觸控目標", async ({ page }) => {
  const option = page.getByRole("button", { name: "自己忍耐" });
  const confirm = page.getByRole("button", { name: "確認" });

  await option.focus();
  await page.keyboard.press("Space");
  await expect(option).toHaveAttribute("aria-pressed", "true");
  await expect(confirm).toBeEnabled();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(confirm).toBeFocused();

  const focusStyle = await confirm.evaluate((element) => {
    const style = window.getComputedStyle(element);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });
  expect(focusStyle).toEqual({ outlineStyle: "solid", outlineWidth: "3px" });

  for (const control of [option, confirm]) {
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(48);
    expect(box!.height).toBeGreaterThanOrEqual(48);
  }
});

test("Q1 參考版面在桌機、平板及手機尺寸不溢出或重疊", async ({ page }) => {
  const viewports = [
    { width: 1280, height: 900 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ];
  const scenarioText = "有人在學校對你做了不舒服的事，你應該告訴誰？";
  const firstAnswer = "告訴一位你覺得安全、願意聽你說的大人";

  for (const { width, height } of viewports) {
    await page.setViewportSize({ width, height });
    await page.goto("/trusted-adult");

    const confirm = page.getByRole("button", { name: "確認" });
    await expect(confirm).toBeInViewport();

    const metrics = await page.evaluate(() => ({
      width: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(metrics.width).toBe(width);
    expect(metrics.scrollWidth).toBeLessThanOrEqual(width);

    const scenario = page.getByText(scenarioText, { exact: true });
    const playback = page.getByRole("button", { name: "重播情境語音" });
    await expect(playback).toBeVisible();
    const ordered = await scenario.evaluate((element) => {
      const button = document.querySelector<HTMLButtonElement>(
        'button[aria-label="重播情境語音"]',
      );
      return Boolean(
        button &&
          (element.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING),
      );
    });
    expect(ordered).toBe(true);

    const scenarioBox = await scenario.boundingBox();
    const playbackBox = await playback.boundingBox();
    expect(scenarioBox).not.toBeNull();
    expect(playbackBox).not.toBeNull();
    const controls = [
      page.getByRole("button", { name: firstAnswer }),
      page.getByRole("button", { name: "自己忍耐" }),
      page.getByRole("button", { name: "那個人的朋友" }),
      confirm,
    ];
    const boxes = [scenarioBox!, playbackBox!];
    for (const control of controls) {
      const box = await control.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      boxes.push(box!);
    }
    for (let i = 1; i < boxes.length; i++) {
      expect(boxes[i].y).toBeGreaterThanOrEqual(boxes[i - 1].y + boxes[i - 1].height - 1);
    }

    await page.getByRole("button", { name: firstAnswer }).click();
    await expect(confirm).toBeEnabled();
  }
});
