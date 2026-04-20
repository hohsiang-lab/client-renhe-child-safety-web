# Tasks: HO-776 — 觸碰測試互動（語音回應）

## Phase 0: Placeholder 音訊
- [ ] T000: 產出 `red-response.mp3`, `yellow-response.mp3`, `green-response.mp3` placeholder 放入 `public/audio/`

## Phase 1: TouchTestPage
- [ ] T001: 新建 `src/pages/TouchTestPage.tsx`（讀取 store doll + marks，顯示人偶 + 燈色 overlay）
- [ ] T002: 新增 hit area click handler（播放音訊 + 觸發 pulse state）
- [ ] T003: 實作 pulse 動畫（AnimatePresence + color ring 擴散）
- [ ] T004: 「我學會了！」按鈕 fixed bottom-right → navigate /ending
- [ ] T005: 音訊 preload on mount（red/yellow/green-response.mp3）
- [ ] T006: data-testid / data attributes for E2E（`data-part-id`, `data-playing`）

## Phase 2: 路由 + 修正
- [ ] T007: `src/App.tsx` 新增 `/body-traffic-light/touch-test` route
- [ ] T008: `src/pages/BodyMarkPage.tsx` navigate → `/body-traffic-light/touch-test`

## Phase 3: E2E 測試
- [ ] T009: `e2e/touch-test.spec.ts` — US1: 點擊部位觸發 data-playing attribute
- [ ] T010: `e2e/touch-test.spec.ts` — US2: 「我學會了！」導向 /ending
- [ ] T011: `e2e/touch-test.spec.ts` — US3: BodyMarkPage 完成設定 → touch-test（修正 HO-775 regression）
- [ ] T012: `e2e/touch-test.spec.ts` — US4: 重複點擊同一部位可再次觸發

## Phase 3.1: 更新既有測試
- [ ] T015: `e2e/body-mark.spec.ts` 更新「完成設定」導向測試（`/body-traffic-light` → `/body-traffic-light/touch-test`）

## Phase 4: Quality
- [ ] T013: `bun run lint` 0 errors
- [ ] T014: E2E 本地跑過（touch-test.spec.ts + body-mark.spec.ts 都 pass）
