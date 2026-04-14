# Tasks: HO-609 身體紅綠燈模組

**Feature**: HO-609-body-traffic-light
**Created**: 2026-04-14
**Status**: Complete

## Chunk 1 — 音檔 + BodySvg 元件

- [x] T-001: 複製 `d008-spec/audio/body-*.mp3`（7 檔）至 `public/audio/`
- [x] T-002: 建立 `src/components/BodySvg.tsx` — 簡化 SVG 人形圖，6 個部位用 `<g>` 包裝

## Chunk 2 — BodyTrafficLightPage 核心邏輯

- [x] T-003: 重寫 `src/pages/BodyTrafficLightPage.tsx` — 狀態管理（activePart, exploredParts, phase）
- [x] T-004: 整合 BodySvg + 資訊面板（部位名稱 + 紅綠燈標示 + 說明文字）
- [x] T-005: 整合 `useAudioPlayer` — 點擊播放 `body-{partId}.mp3`，完成播放 `body-complete.mp3`
- [x] T-006: 進度追蹤 — 顯示已探索數 (N/6)，不重複計數
- [x] T-007: 完成畫面 — 6/6 後顯示鼓勵文字 + 「回到選單」按鈕導向 `/menu`

## Chunk 3 — 動畫 + 響應式

- [x] T-008: Framer Motion 動畫 — 部位 whileTap、資訊面板 AnimatePresence、完成畫面入場
- [x] T-009: 響應式佈局 — 手機縱向排列、平板/桌面 `md:` 橫向排列
- [x] T-010: 進度指示器 — 6 個圓點顯示已探索狀態

## Chunk 4 — E2E 測試

- [x] T-011: 建立 `e2e/body-traffic-light.spec.ts`（8 個測試場景）
- [x] T-012: 本機跑 E2E 確認 8/8 pass

## Chunk 5 — 品質確認

- [x] T-013: `eslint .` 零錯誤
- [x] T-014: `tsc -b && vite build` 零錯誤

## Review Fixes

- [x] T-015: Fatal fix — setTimeout 從 state updater 移至 useEffect
- [x] T-016: Critical fix — SVG `<g>` 加 tabIndex + onKeyDown（鍵盤無障礙）
- [x] T-017: High fix — E2E waitForTimeout 改成 state assertion
- [x] T-018: Minor fix — SVG root 加 role="group" + aria-label
