# Tasks: HO-609 身體紅綠燈模組

**Feature**: HO-609-body-traffic-light
**Created**: 2026-04-14
**Status**: Draft

## Chunk 1 — 音檔 + BodySvg 元件

- [ ] T-001: 複製 `d008-spec/audio/body-head.mp3`, `body-chest.mp3`, `body-hand.mp3`, `body-private.mp3`, `body-leg.mp3`, `body-foot.mp3`, `body-complete.mp3` 至 worktree 的 `public/audio/`
- [ ] T-002: 建立 `src/components/BodySvg.tsx` — 簡化 SVG 人形圖，6 個部位用 `<g>` 包裝，接收 `activePart`, `exploredParts`, `onPartClick` props
  - 每個部位根據 state 顯示不同填色（預設 / 已探索 / 選中）
  - 觸控目標 ≥ 48x48px
  - viewBox 響應式（寬度 100%）

## Chunk 2 — BodyTrafficLightPage 核心邏輯

- [ ] T-003: 重寫 `src/pages/BodyTrafficLightPage.tsx` — 狀態管理（activePart, exploredParts, phase）
- [ ] T-004: 整合 BodySvg + 資訊面板（部位名稱 + 紅綠燈標示 + 說明文字）
- [ ] T-005: 整合 `useAudioPlayer` — 點擊部位播放 `body-{partId}.mp3`，完成播放 `body-complete.mp3`
- [ ] T-006: 進度追蹤 — 顯示已探索數 (N/6)，不重複計數
- [ ] T-007: 完成畫面 — 6/6 探索完畢後顯示鼓勵文字 + 「繼續」按鈕導向 `/ending`

## Chunk 3 — 動畫 + 響應式

- [ ] T-008: Framer Motion 動畫 — 部位點擊 scale pulse、資訊面板 AnimatePresence、完成畫面入場
- [ ] T-009: 響應式佈局 — 手機縱向排列、平板/桌面 `md:` 橫向排列
- [ ] T-010: 進度指示器 — 底部 6 個圓點顯示已探索狀態

## Chunk 4 — E2E 測試

- [ ] T-011: 建立 `e2e/body-traffic-light.spec.ts`
  - 頁面載入顯示標題 + SVG 人形
  - 點擊綠燈部位 → 綠色回饋 + 說明文字
  - 點擊紅燈部位 → 紅色回饋 + 說明文字
  - 探索全部 6 部位 → 完成畫面 + 跳轉 `/ending`
  - 觸控目標 ≥ 48px
- [ ] T-012: 本機跑 E2E 確認全部 pass

## Chunk 5 — 品質確認

- [ ] T-013: `bun run lint` 零錯誤
- [ ] T-014: `tsc -b && vite build` 零錯誤
