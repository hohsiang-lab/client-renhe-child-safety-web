# Feature Specification: 身體紅綠燈 v2 — 觸碰測試互動（語音回應）

**Feature Branch**: `HO-776-btl-v2-touch-test`
**Created**: 2026-04-20
**Status**: Draft
**Input**: HO-776 — [D008] 身體紅綠燈 v2 — 觸碰測試互動（語音回應）
**Parent**: HO-772 — 身體紅綠燈 v2 流程重設計

> Informed by memory: HO-775 retrospective (BTL v2 body-mark pattern), useAudioPlayer hook pattern

## Context

Phase 4 of BTL v2 flow. Previous page (Phase 3) is `BodyMarkPage` at `/body-traffic-light/mark`, which writes `doll` + `marks` to the Zustand store.

Full flow: 規則說明 → 選人偶 → 身體標記 → **觸碰測試** → 結尾

小朋友完成標記後，點擊各部位聽語音回應，學習如何應對。

## Scope Decisions（Evan 確認 2026-04-20）

- **語音檔**：使用 placeholder MP3（`red-response.mp3`, `yellow-response.mp3`, `green-response.mp3`），客戶提供後替換
- **BodyMarkPage 導向修正**：在本 PR 一起修正（`navigate("/body-traffic-light")` → `navigate("/body-traffic-light/touch-test")`）
- **Route**：`/body-traffic-light/touch-test`

## Functional Requirements

### FR-001: 顯示已完成標記的人偶
- 從 Zustand store（`useBodyTrafficLightStore`）讀取 `doll`（female/male）和 `marks`（partId → color）
- 顯示對應人偶圖 `/images/doll-{doll}.png`
- 顯示各部位的燈色標記（與 BodyMarkPage 相同的顏色 overlay）
- 圖片等比例顯示，最大寬度 360px，水平置中

### FR-002: 點擊部位觸發語音 + 視覺回饋
- 與 BodyMarkPage 相同的 hit area 佈局（複用 `bodyPartsV2` 資料）
- 點擊任一部位 → 根據該部位在 store 中的燈色觸發：
  - 🔴 紅燈 → 播放 `/audio/red-response.mp3` + 紅色 pulse 動畫
  - 🟡 黃燈 → 播放 `/audio/yellow-response.mp3` + 黃色 pulse 動畫
  - 🟢 綠燈 → 播放 `/audio/green-response.mp3` + 綠色 pulse 動畫
- Pulse 動畫：被點擊的部位顯示對應顏色的圓環擴散效果（scale 1→1.5 + opacity 1→0）
- 可自由重複點擊探索（無次數限制）

### FR-003: 同時只播一個語音（stop-then-play）
- 呼叫 `useAudioPlayer().play(src)` 前，舊的音訊自動停止（hook 已實作此邏輯）
- 新點擊立即停止舊音訊並播放新音訊

### FR-004: 語音 preload
- 頁面 mount 時 preload 3 個音訊檔（`new Audio(src); audio.load()`）
- 減少首次點擊時的延遲

### FR-005: 「我學會了！」按鈕
- 固定在頁面右下角
- 點擊 → `navigate("/ending")`
- 按鈕始終可見（不需要完成所有部位點擊）

### FR-006: BodyMarkPage 導向修正（HO-775 遺留）
- `BodyMarkPage.tsx` 的「完成設定」按鈕：`navigate("/body-traffic-light")` → `navigate("/body-traffic-light/touch-test")`

## Technical Decisions

### Hit Area 與 Overlay 策略
- 複用 `bodyPartsV2` + 相同的 `position: absolute` + % 定位（與 BodyMarkPage 一致）
- 燈色 overlay：與 BodyMarkPage 相同的 `COLOR_OVERLAY` 常數，透明度 60%
- 按鈕不再是「選擇」而是「觸發播放」，不需要 `selectedPartId` local state
- Pulse 動畫另用 Framer Motion `AnimatePresence` + unique key 觸發（每次點擊生成新 pulse overlay）

### Pulse 動畫實作
- 每次點擊建立一個 `pulseKey`（`${partId}-${Date.now()}`）
- 用 `AnimatePresence` 渲染短暫存在的 pulse overlay div
- `initial: { scale: 1, opacity: 0.8 }` → `animate: { scale: 1.5, opacity: 0 }` → unmount（duration ~600ms）

### 音訊 Preload
```typescript
useEffect(() => {
  const files = ["/audio/red-response.mp3", "/audio/yellow-response.mp3", "/audio/green-response.mp3"];
  files.forEach((src) => { const a = new Audio(src); a.load(); });
}, []);
```

### 狀態管理
- `useBodyTrafficLightStore`（read-only in this page）：`doll`, `marks`
- `pulseState`：`{ partId: string; color: LightColor; key: string } | null`（local useState）
- `useAudioPlayer()` from existing hook

### 路由
- App.tsx 新增 `<Route path="/body-traffic-light/touch-test" element={<TouchTestPage />} />`

## File Changes

- `src/pages/TouchTestPage.tsx` — new
- `src/pages/BodyMarkPage.tsx` — 修正 navigate 路徑（FR-006）
- `src/App.tsx` — 新增 route
- `public/audio/red-response.mp3` — placeholder（空檔或靜音 0.5s）
- `public/audio/yellow-response.mp3` — placeholder
- `public/audio/green-response.mp3` — placeholder
- `e2e/touch-test.spec.ts` — new E2E

## User Scenarios & Testing

### User Story 1 — 點擊有色部位觸發語音 + pulse (Priority: P1)

小朋友看到已標記好的人偶，點擊「私密處」（紅燈），聽到「不可以摸我！」並看到紅色波紋。

**Acceptance Scenarios**:
1. **Given** 進入 `/body-traffic-light/touch-test`（store marks: private=red）, **When** 頁面載入, **Then** 顯示人偶 + 各部位燈色 overlay
2. **Given** marks 已設好, **When** 點擊 `data-part-id="private"` hit area, **Then** 觸發播放 `red-response.mp3`（data-playing="private" 出現）
3. **Given** red 部位正在播音, **When** 點擊 `data-part-id="belly"`（green）, **Then** 舊音訊停止，播放 `green-response.mp3`

### User Story 2 — 「我學會了！」導向結尾頁 (Priority: P1)

**Acceptance Scenarios**:
1. **Given** 頁面已載入, **When** 點擊「我學會了！」, **Then** 導向 `/ending`

### User Story 3 — BodyMarkPage 導向到觸碰測試頁 (Priority: P1)

**Acceptance Scenarios**:
1. **Given** 身體標記頁 10/10 已完成, **When** 點擊「完成設定」, **Then** 導向 `/body-traffic-light/touch-test`（不是 `/body-traffic-light`）

### User Story 4 — 重複點擊自由探索 (Priority: P2)

**Acceptance Scenarios**:
1. **Given** 已點擊過「私密處」, **When** 再次點擊「私密處」, **Then** 再次播放 `red-response.mp3`

## Alternatives Considered

| Option | Decision | Why |
|--------|----------|-----|
| 把 TouchTestPage 做成 BodyMarkPage 的 sub-view（tab）| 拒絕 | 增加實作複雜度，且 spec 明確要獨立路由 |
| 新增 `LightColor → string` audio mapping 到 store | 拒絕 | audio constants 不需要跨頁共用，放 page-level 常數即可 |
| 新增部位點擊計數器 | 拒絕 | spec 明確「無次數限制，自由探索」 |

## Out of Scope

- 語音文字（字幕）
- 各部位說明文字彈窗
- 客戶提供音訊的替換流程（placeholder 先用）
- 男/女人偶各別 hit area 座標（沿用 HO-775 共用表）
- 進度條或儲存功能
