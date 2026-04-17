# Implementation Plan: 身體紅綠燈 v2 — 規則說明動畫頁

**Feature**: HO-773-btl-v2-intro
**Created**: 2026-04-17
**Status**: Draft

## Overview

`BodyTrafficLightPage.tsx` 從舊版 HO-609（6 部位 SVG 互動）完整替換為新版 v2 規則說明動畫頁。

新頁面職責：
- 依序展示 🟢🟡🔴 三個燈（Framer Motion stagger pop-in）
- 每個燈出現時自動播放 TTS 語音 + 顯示說明文字
- 三燈全部出現後顯示「我知道了！」按鈕
- 按鈕導向 `/body-traffic-light/pick-doll`（HO-774 實作的路由）

同時需在 `public/audio/` 加入三支 TTS 語音檔案。

## Implementation Strategy

最小改動策略：
1. 重寫 `BodyTrafficLightPage.tsx`（route 不變，App.tsx 不動）
2. 新增三支 TTS 音檔到 `public/audio/`
3. 新增 E2E 測試
4. **不移除** `App.tsx` 的 `/body-traffic-light/pick-doll` route（由 HO-774 加入）

## Changes

| 檔案 | 動作 | 說明 |
|------|------|------|
| `src/pages/BodyTrafficLightPage.tsx` | 重寫 | 替換為 v2 規則說明動畫頁 |
| `public/audio/btl-green.mp3` | 新增 | TTS 語音：「普通朋友可以碰觸的地方」 |
| `public/audio/btl-yellow.mp3` | 新增 | TTS 語音：「要先問我才能碰的地方」 |
| `public/audio/btl-red.mp3` | 新增 | TTS 語音：「任何人都不能隨意碰的地方（除了家長和醫生）」 |
| `e2e/body-traffic-light-v2-intro.spec.ts` | 新增 | E2E 測試 |

## Technical Details

### 1. 三燈資料結構

```typescript
const LIGHTS = [
  {
    id: "green",
    emoji: "🟢",
    color: "text-green-500",
    bgColor: "bg-green-100",
    text: "普通朋友可以碰觸的地方",
    audio: "/audio/btl-green.mp3",
  },
  {
    id: "yellow",
    emoji: "🟡",
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
    text: "要先問我才能碰的地方",
    audio: "/audio/btl-yellow.mp3",
  },
  {
    id: "red",
    emoji: "🔴",
    color: "text-red-500",
    bgColor: "bg-red-100",
    text: "任何人都不能隨意碰的地方（除了家長和醫生）",
    audio: "/audio/btl-red.mp3",
  },
] as const;
```

### 2. 動畫序列設計

```typescript
// 頁面 mount 後逐步顯示燈
const [visibleCount, setVisibleCount] = useState(0);

useEffect(() => {
  const timers: ReturnType<typeof setTimeout>[] = [];
  LIGHTS.forEach((light, i) => {
    timers.push(setTimeout(() => {
      setVisibleCount(i + 1);
      play(light.audio);
    }, i * 1500)); // 每 1.5 秒出現一個
  });
  return () => timers.forEach(clearTimeout);
}, []);
```

每個燈用 `motion.div` pop-in（scale 0.5→1, opacity 0→1）：
```typescript
const popIn = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: "spring", duration: 0.5 },
};
```

「我知道了！」按鈕在 `visibleCount === 3` 時以 `AnimatePresence` + fade-in 出現。

### 3. 語音整合

沿用 `useAudioPlayer` hook（HO-609 已驗證），呼叫 `play(audioPath)`。
語音 graceful degrade 由 hook 內部處理（onerror 不 throw）。

### 4. 佈局設計

- 垂直置中，三燈垂直排列
- 每個燈：大 emoji + 右側說明文字（flex row）
- 按鈕：primary 樣式，置中，出現後 sticky 感（底部固定或自然 flow）
- 背景：沿用 `bg-warm-bg`

### 5. TTS 語音產生

使用 macOS `say` CLI 或 sherpa-onnx-tts skill 產生三支語音：
```bash
# macOS say CLI（快速方案）
say -v Meijia "普通朋友可以碰觸的地方" -o btl-green.aiff
ffmpeg -i btl-green.aiff public/audio/btl-green.mp3
# ... repeat for yellow/red
```

若環境不支援，使用 sherpa-onnx-tts OpenClaw skill。

### 6. E2E 測試設計

```typescript
test("三色燈依序出現 + 按鈕在全部出現後顯示", async ({ page }) => {
  await page.goto("/body-traffic-light");
  // 初始：按鈕不存在
  await expect(page.getByRole("button", { name: "我知道了！" })).not.toBeVisible();
  // 等三個燈出現（3 * 1500ms + buffer）
  await page.waitForTimeout(5000);
  // 按鈕出現
  await expect(page.getByRole("button", { name: "我知道了！" })).toBeVisible();
  // 三個燈文字
  await expect(page.getByText("普通朋友可以碰觸的地方")).toBeVisible();
  await expect(page.getByText("要先問我才能碰的地方")).toBeVisible();
  await expect(page.getByText("任何人都不能隨意碰的地方")).toBeVisible();
});

test("點擊「我知道了！」導向人偶選擇頁", async ({ page }) => {
  await page.goto("/body-traffic-light");
  await page.waitForTimeout(5000);
  await page.getByRole("button", { name: "我知道了！" }).click();
  await expect(page).toHaveURL("/body-traffic-light/pick-doll");
});
```

## Dependencies

- `src/hooks/useAudioPlayer.ts` ✅
- Framer Motion ✅（已安裝）
- `/audio/btl-{green,yellow,red}.mp3` — 需產生（TTS）
- `/body-traffic-light/pick-doll` route — HO-774 實作，E2E 測試確認 URL 正確即可

## Risks

| 風險 | 可能性 | 影響 | 緩解 |
|------|--------|------|------|
| `/body-traffic-light/pick-doll` 路由在 HO-774 前不存在 | 高 | 低 | E2E 只測 URL 跳轉，不測 pick-doll 頁面 render |
| TTS 語音品質不符客戶期望 | 中 | 低 | 僅 placeholder，真人配音後再替換 |
| macOS `say` 無 Meijia 聲音 | 低 | 低 | fallback 到 sherpa-onnx-tts skill |
