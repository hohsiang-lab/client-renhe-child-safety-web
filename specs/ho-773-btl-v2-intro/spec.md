# Feature Specification: 身體紅綠燈 v2 — 規則說明動畫頁

**Feature Branch**: `HO-773-btl-v2-intro`
**Created**: 2026-04-17
**Status**: Draft
**Input**: HO-773 — [D008] 身體紅綠燈 v2 — 規則說明動畫頁

> Informed by memory: HO-609 使用 Framer Motion + useAudioPlayer hook 做動畫與語音，此 issue 沿用同樣 pattern
> Owner decisions (2026-04-17): Q1=C（替換 /body-traffic-light），Q2=TTS 自產，Q3=取代舊版

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 三色燈規則動畫展示 (Priority: P1)

小朋友進入 `/body-traffic-light`，依序看到 🟢🟡🔴 三個燈以 pop-in 動畫出現，每個燈旁邊顯示說明文字，同時自動播放對應語音。三個燈全部出現後，「我知道了！」按鈕出現。

**Why this priority**: 這是 v2 整個流程的第一頁，也是唯一的教學頁。沒有這頁，小朋友無法理解三色規則就進入後續互動。

**Independent Test**: 進入 `/body-traffic-light`，觀察三個燈依序 pop-in 出現，每個燈出現後播放語音並顯示文字說明，最後「我知道了！」按鈕出現。

**Acceptance Scenarios**:

1. **Given** 使用者進入 `/body-traffic-light`, **When** 頁面載入, **Then** 先只顯示頁面標題，三個燈初始隱藏
2. **Given** 頁面載入完成, **When** 動畫序列開始, **Then** 🟢 以 scale+opacity pop-in 動畫出現，同時播放 `btl-green.mp3`，顯示文字「普通朋友可以碰觸的地方」
3. **Given** 🟢 出現後, **When** 約 1.5 秒後, **Then** 🟡 以相同 pop-in 動畫出現，播放 `btl-yellow.mp3`，顯示文字「要先問我才能碰的地方」
4. **Given** 🟡 出現後, **When** 約 1.5 秒後, **Then** 🔴 以相同 pop-in 動畫出現，播放 `btl-red.mp3`，顯示文字「任何人都不能隨意碰的地方（除了家長和醫生）」
5. **Given** 🔴 出現後, **When** 動畫完成, **Then** 「我知道了！」按鈕以 fade-in 出現（無需額外等待）

---

### User Story 2 - 點擊「我知道了！」進入下一階段 (Priority: P1)

所有三個燈出現後，小朋友點擊「我知道了！」按鈕進入人偶選擇頁（HO-774 定義的路由）。

**Why this priority**: 按鈕是流程唯一出口，缺少會讓流程斷掉。

**Independent Test**: 三個燈動畫結束後，點擊「我知道了！」，確認導向人偶選擇頁。

**Acceptance Scenarios**:

1. **Given** 三個燈都已出現, **When** 使用者點擊「我知道了！」, **Then** 導向 `/body-traffic-light/pick-doll`（HO-774 路由，暫定）
2. **Given** 三個燈尚未全部出現, **When** 查看畫面, **Then** 「我知道了！」按鈕不可見（不可點）

---

### User Story 3 - 語音播放（TTS placeholder）(Priority: P2)

三個燈各自出現時自動播放 TTS 產生的語音說明，使用現有 `useAudioPlayer` hook。若語音不存在或載入失敗，動畫視覺效果不受影響。

**Why this priority**: 語音提升教學效果，但視覺動畫是核心；語音失敗不能阻塞流程。

**Independent Test**: 將 `btl-green.mp3` 從 `public/audio/` 移除，確認 🟢 出現時視覺動畫正常，無報錯。

**Acceptance Scenarios**:

1. **Given** 語音檔存在, **When** 燈出現, **Then** 自動播放對應 TTS 語音
2. **Given** 語音正在播放, **When** 下一個燈出現, **Then** 停止前一個語音再播新語音
3. **Given** 語音檔不存在或載入失敗, **When** 燈出現, **Then** 動畫正常，靜音處理

---

### Edge Cases

- **動畫中途 navigate 離開**：動畫 timer/audio 清除（useEffect cleanup）
- **快速 back/forward**：重新進入頁面動畫從頭開始（無需記憶狀態）
- **音訊全部載入失敗**：只有視覺效果，不報錯，完整流程可走完
- **平板觸控**：三個燈垂直排列，文字可讀，按鈕觸控目標 ≥ 48px
- **舊版 `/body-traffic-light` 路由**：完全被此頁面取代，舊 BodyTrafficLightPage.tsx 移除

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 頁面 MUST 依序以 pop-in 動畫展示 🟢🟡🔴 三個燈，stagger 間隔約 1.5 秒
- **FR-002**: 每個燈出現時 MUST 顯示對應說明文字（見 Scenarios）
- **FR-003**: 每個燈出現時 SHOULD 自動播放對應語音（graceful degrade：無音訊不阻塞）
- **FR-004**: 第三個燈（🔴）出現後 MUST 顯示「我知道了！」按鈕（fade-in）
- **FR-005**: 點擊「我知道了！」MUST 導向人偶選擇頁（路由暫定 `/body-traffic-light/pick-doll`）
- **FR-006**: `BodyTrafficLightPage.tsx`（舊版 HO-609）MUST 被此頁面取代，`App.tsx` route 不變
- **FR-007**: 使用 Framer Motion `motion.div` + `initial/animate/exit` 做 pop-in 動畫
- **FR-008**: 使用現有 `useAudioPlayer` hook 播放語音

### Non-Functional Requirements

- **NF-001**: 三個燈 + 按鈕動畫流程可在低階 Android 平板（Chrome）流暢運作
- **NF-002**: 三支 TTS 語音（`btl-green.mp3`、`btl-yellow.mp3`、`btl-red.mp3`）加入 `public/audio/`

### Out of Scope

- 人偶選擇頁（HO-774）
- 身體標記互動（後續 sub-issue）
- 觸碰測試（後續 sub-issue）
- 真人配音替換 TTS（待客戶提供素材後另行 PR）

## Alternatives Considered

- **A: 內部 phase state 切換（Q1 選項 A）**：整個流程共用同一 route，用 `phase` state 管理。優點：不需定義多條 route。缺點：單一頁面代碼膨脹，且後續 sub-issue 無法獨立部署測試。**棄用（owner 選 C）。**
- **B: 各 phase 獨立 route（Q1 選項 B）**：每頁有自己的 `/btl-v2/*` 路由。優點：清晰隔離。缺點：多了 route 定義，且與舊版 route 不兼容。**棄用（owner 選 C）。**
- **CSS-only animation（vs Framer Motion）**：Framer Motion 已在 HO-609 建立為 pattern，保持一致性。

## Security Considerations

- 無 PII 資料，無後端 API 呼叫，靜態前端頁面
- 語音檔案路徑不接受外部輸入
