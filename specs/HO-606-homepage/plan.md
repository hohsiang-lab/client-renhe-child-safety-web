# Implementation Plan: 首頁開發

**Feature**: HO-606-homepage
**Created**: 2026-04-14
**Status**: Draft

## Overview

在 HO-604（前端架構）和 HO-605（語音系統）基礎上，完成首頁的完整實作。主要工作是整合歡迎語音、優化視覺設計、確保響應式排版。

## Implementation Strategy

### 策略：增量修改現有 HomePage.tsx

現有 `src/pages/HomePage.tsx` 已有基本骨架（標題、placeholder、按鈕、動畫），不需從頭寫。改動範圍：

1. 整合 `useAudioPlayer` hook 播放歡迎語音
2. 複製 `home-welcome.mp3` 到 `src/assets/audio/`
3. 優化 UI 視覺（背景、角色 placeholder、副標題）
4. 確保響應式排版正確

### 為什麼不重寫

現有骨架結構正確（Framer Motion 動畫、router navigate、Tailwind 樣式），只需加上語音整合和視覺優化。重寫會引入不必要的 diff。

## Technical Details

### 1. 語音整合

```tsx
// HomePage.tsx 加入 useAudioPlayer
const { play } = useAudioPlayer();

function handleStart() {
  play("/audio/home-welcome.mp3");
  navigate("/menu");
}
```

語音在導航後繼續播放（AudioProvider 是 App 層級，不會因 HomePage unmount 而停止）— 這是 HO-605 已確認的行為。

### 2. 音檔路徑

MP3 放在 `public/audio/` 而非 `src/assets/audio/`，因為：
- Vite 對 `public/` 的檔案不做 hash，路徑穩定
- 音檔不需要 tree-shaking 或 module import
- 與 HO-605 spec 的 preload 機制一致

### 3. 角色圖片 Placeholder

HO-601 尚未產出，placeholder 使用 emoji + 文字描述，而非空白 div 或 broken image。

### 4. 響應式設計

App.tsx 已有 `max-w-[960px] mx-auto`，首頁只需確保內部元素在不同寬度下正常排版。

## Files to Modify

| 檔案 | 動作 | 說明 |
|------|------|------|
| `src/pages/HomePage.tsx` | 修改 | 整合語音、優化 UI |
| `public/audio/home-welcome.mp3` | 新增 | 從 d008-spec/audio/ 複製 |

## Dependencies

- HO-604 ✅（前端架構已 merge）
- HO-605 ✅（語音系統已 merge）
- HO-601 ⏳（角色圖片 — 使用 placeholder）

## Risks

| 風險 | 機率 | 影響 | 對策 |
|------|------|------|------|
| 歡迎語音在 iOS Safari 無法播放 | 低 | 中 | HO-605 已處理 autoplay unlock，「開始探險」按鈕是 user gesture |
| 角色圖片 placeholder 不好看 | 中 | 低 | 用 emoji + 溫暖底色 placeholder，HO-601 完成後替換 |
