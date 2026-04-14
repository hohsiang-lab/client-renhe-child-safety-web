# Implementation Plan: 身體紅綠燈模組 — SVG 人形互動

**Feature**: HO-609-body-traffic-light
**Created**: 2026-04-14
**Status**: Draft

## Overview

BodyTrafficLightPage.tsx 目前是 stub，需完整重寫為自由探索式互動頁面。需要新增一個 SVG 人形元件（BodySvg），頁面串接現有資料層 (`bodyParts.ts`) 和音效層 (`useAudioPlayer`)。音檔已就緒於 `d008-spec/audio/`，需複製到 `public/audio/`。

## Implementation Strategy

三個檔案變更：
1. 新增 `src/components/BodySvg.tsx` — SVG 人形元件（可點擊的 6 部位）
2. 重寫 `src/pages/BodyTrafficLightPage.tsx` — 頁面邏輯 + 狀態管理 + UI
3. 複製音檔 `d008-spec/audio/body-*.mp3` → `public/audio/`

## Changes

| 檔案 | 動作 | 說明 |
|------|------|------|
| `src/components/BodySvg.tsx` | 新增 | SVG 人形圖，6 個 `<g>` 區域，接收 onClick + activePart + exploredParts props |
| `src/pages/BodyTrafficLightPage.tsx` | 重寫 | 自由探索狀態機、部位資訊面板、完成畫面 |
| `public/audio/body-*.mp3` | 新增 | 7 個音檔（6 部位 + 1 完成）從 d008-spec/audio/ 複製 |
| `e2e/body-traffic-light.spec.ts` | 新增 | E2E 測試 |

## Technical Details

### 1. BodySvg 元件設計

簡化人形 SVG：用幾何形狀（圓形 + 矩形 + 橢圓）組成人形輪廓，6 個部位各用 `<g>` 包裝：

- `head`: 圓形（頭部）
- `chest`: 矩形（上半身 / 胸部）
- `hand`: 左右兩個小矩形（手臂/手）
- `private`: 矩形（下腹部）
- `leg`: 左右兩個長矩形（腿）
- `foot`: 左右兩個小矩形（腳）

Props:
```typescript
interface BodySvgProps {
  activePart: string | null;
  exploredParts: Set<string>;
  onPartClick: (partId: string) => void;
}
```

每個部位 `<g>`:
- 預設：淡色填充
- 已探索：根據 signal 微亮（green/red 低透明度）
- 當前選中（active）：根據 signal 高亮（green-safe / red-danger）
- SVG viewBox 設計成響應式（寬度 100%，max-width 限制）
- 觸控目標確保 ≥ 48x48px

### 2. BodyTrafficLightPage 狀態管理

```typescript
const [activePart, setActivePart] = useState<string | null>(null);
const [exploredParts, setExploredParts] = useState<Set<string>>(new Set());
const [phase, setPhase] = useState<"exploring" | "complete">("exploring");
```

流程：
1. 點擊部位 → `setActivePart(partId)` + 加入 `exploredParts` + 播放語音
2. 若 `exploredParts.size === 6` → 延遲後切換至 `phase: "complete"`
3. 完成畫面：鼓勵文字 + 播放 `body-complete.mp3` + 「繼續」按鈕 → `/menu`

### 3. 音效整合

```typescript
const { play, stop } = useAudioPlayer();

// 點擊部位
play(`/audio/body-${partId}.mp3`);

// 完成
play("/audio/body-complete.mp3");
```

### 4. 動畫

- 部位點擊：Framer Motion `animate` 控制 fill 顏色漸變 + scale pulse
- 資訊面板：`AnimatePresence` 切換不同部位說明
- 完成畫面：fade-in + scale-up 入場動畫
- 進度指示器：已探索部位亮燈動畫

### 5. 設計 token 使用

- `bg-warm-bg` — 頁面背景
- `bg-warm-card` — 資訊面板
- `text-green-safe` / `bg-green-safe-bg` — 綠燈部位
- `text-red-danger` / `bg-red-danger-bg` — 紅燈部位
- `bg-primary` / `hover:bg-primary-hover` — 按鈕

### 6. 響應式佈局

- 手機：SVG 上方 + 資訊面板下方（縱向排列）
- 平板/桌面：SVG 左側 + 資訊面板右側（橫向排列）
- breakpoint: `md:` (768px)

## Dependencies

- `src/data/bodyParts.ts` ✅
- `src/hooks/useAudioPlayer.ts` ✅
- `d008-spec/audio/body-*.mp3` ✅（需複製到 public/audio/）

## Risks

| 風險 | 可能性 | 影響 | 緩解 |
|------|--------|------|------|
| SVG hitbox 在小螢幕太小 | 中 | 中 | 確保 min touch target 48px + viewBox 比例不壓縮部位 |
| iOS Safari SVG 觸控事件 | 低 | 高 | 用 onClick 而非 onTouchEnd，React 已統一事件處理 |
| 語音載入失敗 | 低 | 低 | useAudioPlayer 已有 graceful degrade |
