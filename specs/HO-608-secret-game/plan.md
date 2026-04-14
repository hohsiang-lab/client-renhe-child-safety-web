# Implementation Plan: 秘密遊戲模組

**Feature**: HO-608-secret-game
**Created**: 2026-04-14
**Status**: Draft

## Overview

SecretGamePage.tsx 目前是 stub，需完整重寫為遊戲邏輯。資料層 (`secrets.ts`) 和音效層 (`useAudioPlayer`) 已就緒，只需在頁面內串接。

## Implementation Strategy

單檔重寫 `src/pages/SecretGamePage.tsx`，不新增檔案。

## Changes

| 檔案 | 動作 | 說明 |
|------|------|------|
| `src/pages/SecretGamePage.tsx` | 重寫 | 遊戲狀態機、題目卡片、回饋 overlay、完成畫面 |

## Technical Details

1. **狀態管理**：`useState` 管理 `currentIndex`、`score`、`phase`（playing / correct / wrong / complete）、`shuffledQuestions`
2. **初始化**：`useMemo` 隨機排序 `secretQuestions`
3. **答題流程**：點按鈕 → 比對 answer → phase 切換 → correct: 2s setTimeout 自動 advance / wrong: 手動 advance
4. **音效**：`useAudioPlayer` 播放情境/回饋音效，onerror graceful degrade
5. **動畫**：Framer Motion `AnimatePresence` + `motion.div` 切換題目，星星用 scale+rotate 動畫
6. **完成畫面**：顯示 `score/6`，按鈕 navigate 到 `/ending`
7. **設計 token**：green-safe-bg（答對）、red-danger-bg（答錯）、warm-card（卡片底色）

## Dependencies

- secrets.ts ✅ — 6 題資料
- useAudioPlayer ✅ — 音效播放
- HO-612 ⏳ — 音檔（graceful degrade）
