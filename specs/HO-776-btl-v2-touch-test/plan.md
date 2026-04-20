# Implementation Plan: HO-776 — 觸碰測試互動（語音回應）

**Branch**: `HO-776-btl-v2-touch-test`
**Base**: `origin/HO-774-btl-v2-pick-doll`（含 HO-775 的 BodyMarkPage 實作）

## Phase 0: Placeholder 音訊檔

產出 3 個靜音 placeholder MP3，放入 `public/audio/`：
- `red-response.mp3`
- `yellow-response.mp3`
- `green-response.mp3`

工具：`ffmpeg -f lavfi -i anullsrc -t 0.5 -ar 44100 -ac 1 <file>.mp3`（若無 ffmpeg，用 btl-red.mp3 複製作為 placeholder）

## Phase 1: TouchTestPage 元件

新建 `src/pages/TouchTestPage.tsx`：
1. 從 store 讀取 `doll` + `marks`
2. 顯示人偶圖 + 燈色 overlay（複用 BodyMarkPage 的 sortedZones + COLOR_OVERLAY 邏輯）
3. 點擊 hit area → 播放對應音訊 + 觸發 pulse 動畫
4. Pulse 動畫：`AnimatePresence` + 短暫存在的 overlay div
5. 「我學會了！」按鈕（fixed bottom-right）→ `navigate("/ending")`
6. 音訊 preload on mount

## Phase 2: 路由 + BodyMarkPage 修正

1. `src/App.tsx`：新增 `/body-traffic-light/touch-test` route
2. `src/pages/BodyMarkPage.tsx`：修正 navigate 路徑（FR-006）

## Phase 3: E2E 測試

新建 `e2e/touch-test.spec.ts`：
- User Story 1：data-playing attribute 驗證
- User Story 2：「我學會了！」導向
- User Story 3：BodyMarkPage navigate 修正
- User Story 4：重複點擊

## Phase 4: Review + CI

1. `bun run lint` 0 errors
2. Run E2E locally
3. Commit + push
4. PR → CI pass
