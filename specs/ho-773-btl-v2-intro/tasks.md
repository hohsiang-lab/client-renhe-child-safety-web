# Tasks: 身體紅綠燈 v2 — 規則說明動畫頁

**Feature**: HO-773-btl-v2-intro
**Created**: 2026-04-17
**Status**: Pending

## Implementation Tasks

- [ ] **T1**: 產生 TTS 語音（btl-green.mp3、btl-yellow.mp3、btl-red.mp3），放入 `public/audio/`
- [ ] **T2**: 重寫 `src/pages/BodyTrafficLightPage.tsx` — 三燈資料結構 + stagger 動畫序列 + `useAudioPlayer` 整合
- [ ] **T3**: 實作燈光 pop-in 動畫（Framer Motion `motion.div`，scale + opacity spring）
- [ ] **T4**: 實作「我知道了！」按鈕（fade-in，在第三個燈出現後顯示，點擊導向 `/body-traffic-light/pick-doll`）
- [ ] **T5**: 實作 RWD 佈局（垂直排列，三燈 + 說明文字 + 按鈕）

## Testing Tasks

- [ ] **T6**: 新增 E2E 測試 `e2e/body-traffic-light-v2-intro.spec.ts`
  - Scenario 1: 三色燈依序出現，按鈕在全部出現後才顯示
  - Scenario 2: 三個說明文字都可見
  - Scenario 3: 點擊「我知道了！」導向 `/body-traffic-light/pick-doll`
  - Scenario 4: 按鈕在動畫完成前不可見

## Cleanup / Infra Tasks

- [ ] **T7**: 確認 `bun run lint` 0 errors
- [ ] **T8**: 確認 `bun run build` 通過
