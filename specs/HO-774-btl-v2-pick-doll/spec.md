# Feature Specification: 身體紅綠燈 v2 — 人偶選擇頁

**Feature Branch**: `HO-774-btl-v2-pick-doll`
**Created**: 2026-04-17
**Status**: Draft
**Input**: HO-774 — [D008] 身體紅綠燈 v2 — 人偶選擇 + 客戶圖素材整合
**Parent**: HO-772 — 身體紅綠燈 v2 流程重設計

## Context

Phase 2 of BTL v2 flow. Previous page (Phase 1) is `BodyTrafficLightPage` at `/body-traffic-light`, which navigates here via "我知道了！" button.

Full flow: 規則說明 → **選人偶** → 身體標記 → 觸碰測試 → 結尾

## Functional Requirements

### FR-001: 顯示男女人偶選擇卡片
- 兩張卡片並排顯示（手機為上下排列）
- 卡片內容：客戶提供 PNG 圖 + 標籤（「女生」/ 「男生」）
- 圖片路徑：`/images/doll-female.png`、`/images/doll-male.png`

### FR-002: 點選高亮狀態
- 點擊卡片後顯示選中狀態（border ring 或類似視覺回饋）
- 同一時間只能選一張
- 再次點擊不能取消選擇（至少一個必選）

### FR-003: 「選好了」按鈕
- 選擇後才啟用（未選擇時 disabled）
- 點擊後導向 `/body-traffic-light/mark?doll=female` 或 `?doll=male`
- URL query param 傳遞選擇給 Phase 3

## Technical Decisions

**PNG 疊加透明 hit area（Evan 2026-04-17 確認）**：
- Phase 3（身體標記）用 `position: absolute` 透明 `<button>` 疊加 PNG
- Phase 2 本頁只需展示圖片 + 選擇狀態，無 hit area 需求
- Selected state: Tailwind `ring-4 ring-blue-500` + scale transform

**圖片準備**：
- 客戶圖尚未加入 repo，先用 placeholder（背景色 + 文字）
- Evan 需將 `d008-body-traffic-light-female-doll.png` 和 `...male-doll.png` 放至 `public/images/`

## User Scenarios & Testing

### User Story 1 - 選擇女生人偶並繼續 (Priority: P1)

兒童看到兩張人偶卡片，點擊女生人偶後卡片高亮，「選好了」按鈕變為可點擊。按下後跳轉至身體標記頁（Phase 3），URL 帶 `?doll=female`。

**Acceptance Scenarios**:
1. **Given** 進入 `/body-traffic-light/pick-doll`, **When** 頁面載入, **Then** 顯示「選一個你喜歡的人偶」標題 + 女生卡片 + 男生卡片 + disabled「選好了」按鈕
2. **Given** 頁面載入完成, **When** 點擊女生卡片, **Then** 女生卡片顯示選中狀態，男生卡片無選中狀態
3. **Given** 女生已選中, **When** 點擊「選好了」, **Then** 導向 `/body-traffic-light/mark?doll=female`
4. **Given** 女生已選中, **When** 點擊男生卡片, **Then** 選擇切換至男生，女生卡片取消高亮

### User Story 2 - 選擇男生人偶並繼續 (Priority: P1)

與 US1 對稱，選擇男生 → `?doll=male`。

**Acceptance Scenarios**:
1. **Given** 點擊男生卡片, **When** 點「選好了」, **Then** 導向 `/body-traffic-light/mark?doll=male`

### User Story 3 - 未選擇前按鈕不可點 (Priority: P1)

**Acceptance Scenarios**:
1. **Given** 頁面載入（未選擇）, **When** 「選好了」按鈕存在, **Then** 按鈕為 disabled 狀態
2. **Given** 未選擇狀態, **When** 點擊「選好了」, **Then** 無導航發生

## Out of Scope

- Phase 3 身體標記頁（下一個 issue）
- 音效（本頁無語音需求）
- 動畫（基本 framer-motion enter 即可，非必要）

## File Changes

- `src/pages/PickDollPage.tsx` — new
- `src/App.tsx` — add route `/body-traffic-light/pick-doll`
- `e2e/pick-doll.spec.ts` — new E2E spec
- `public/images/` — doll PNG placeholder (pending client assets)
