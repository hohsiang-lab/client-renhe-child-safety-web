# Feature Specification: 首頁開發

**Feature Branch**: `HO-606-homepage`
**Created**: 2026-04-14
**Status**: Draft
**Input**: HO-606 — 首頁開發（網站入口頁面）

> Informed by memory: 無相關歷史記錄（D008 為新專案，HO-604/605 已 merge）

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 首頁載入與進入遊戲 (Priority: P1)

兒童開啟網站後看到歡迎畫面，點擊「開始探險」按鈕進入遊戲選單。

**Why this priority**: 首頁是使用者進入網站的唯一入口，必須能正常渲染、導航。

**Independent Test**: 開啟首頁 `/`，看到標題與按鈕，點擊按鈕跳轉到 `/menu`。

**Acceptance Scenarios**:

1. **Given** 使用者開啟網站根路徑, **When** 頁面載入完成, **Then** 顯示「保護自己大冒險」標題、角色圖片區域、「開始探險」按鈕
2. **Given** 首頁已載入, **When** 點擊「開始探險」按鈕, **Then** 導航到 `/menu` 頁面，有頁面轉場動畫

---

### User Story 2 - 歡迎語音播放 (Priority: P1)

首次進入首頁時，使用者點擊畫面（或「開始探險」按鈕）觸發歡迎語音播放，同時導航至選單。

**Why this priority**: 語音引導是本網站核心體驗。首頁歡迎語是兒童的第一個聽覺接觸點，必須在使用者互動後播放（瀏覽器 autoplay 限制）。

**Independent Test**: 開啟首頁，點擊「開始探險」，聽到歡迎語音，同時跳轉至選單。

**Acceptance Scenarios**:

1. **Given** 首頁已載入, **When** 使用者點擊「開始探險」, **Then** 播放 `home-welcome.mp3` 歡迎語音，同時導航至 `/menu`
2. **Given** 歡迎語音正在播放, **When** 使用者已在 `/menu` 頁面, **Then** 語音繼續播放至結束（不因頁面切換中斷）
3. **Given** 裝置處於靜音模式, **When** 使用者點擊「開始探險」, **Then** 語音不發出聲音但 onEnd 仍正常觸發，導航正常

---

### User Story 3 - 響應式排版 (Priority: P2)

首頁在平板（主要）、手機、桌機上都能正常顯示，排版自適應。

**Why this priority**: 主要使用裝置是平板，但手機和桌機也要能用。

**Independent Test**: 分別在 768px（平板）、375px（手機）、1024px（桌機）寬度下檢視首頁排版。

**Acceptance Scenarios**:

1. **Given** 平板橫向（≥768px）, **When** 開啟首頁, **Then** 內容置中，最大寬度 960px，元素間距適當
2. **Given** 手機（<600px）, **When** 開啟首頁, **Then** 全寬排版，文字和按鈕大小不變，觸控目標 ≥48px
3. **Given** 桌機（≥1024px）, **When** 開啟首頁, **Then** 內容置中，不拉伸超過 960px

---

### Edge Cases

- **角色圖片未就緒**：HO-601 角色圖尚未製作，首頁需有合理的 placeholder（不能是空白區域或 broken image）
- **歡迎語音載入失敗**：MP3 載入失敗時，不阻塞導航。使用者仍可正常進入選單。
- **重複進入首頁**：使用者從 `/menu` 返回首頁，歡迎語音不重複自動播放（只在點擊按鈕時播放）。
- **觸控目標大小**：「開始探險」按鈕最小 48x48px，符合 WCAG 觸控標準。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 首頁 MUST 顯示網站標題「保護自己大冒險」
- **FR-002**: 首頁 MUST 顯示角色圖片區域（目前為 placeholder，待 HO-601 產出後替換）
- **FR-003**: 首頁 MUST 提供「開始探險」按鈕，點擊後導航至 `/menu`
- **FR-004**: 首頁 MUST 在使用者點擊「開始探險」時播放 `home-welcome.mp3`（利用 HO-605 的 `useAudioPlayer` hook）
- **FR-005**: 首頁 MUST 有 Framer Motion 頁面進入動畫（fadeIn + slideUp）
- **FR-006**: 首頁 MUST 符合響應式設計規範（平板優先、手機適配、桌機置中）
- **FR-007**: 首頁 MUST 使用專案設計系統（warm-bg 背景、primary 色按鈕、Noto Sans TC 字體）

### Key Entities

- **HomePage**: 首頁元件，路由 `/`
- **AudioTrack**: `home-welcome.mp3`，由 `useAudioPlayer` 管理播放

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 首頁載入後 1 秒內完成渲染（含動畫開始）
- **SC-002**: 點擊「開始探險」後，歡迎語音開始播放且頁面導航至 `/menu`
- **SC-003**: 在 768px 和 375px 寬度下，所有元素正常顯示，無溢出或重疊
- **SC-004**: 語音載入失敗時，導航在 1 秒內完成（不卡住）

## Assumptions

- `home-welcome.mp3` 已存在於 `d008-spec/audio/`，需複製到 `src/assets/audio/`
- 角色圖片尚未就緒（HO-601），使用 placeholder
- AudioProvider 和 useAudioPlayer 已由 HO-605 實作完成
- 無後端需求，純前端靜態頁面

## Alternatives Considered

### 語音播放時機：進入時自動播放 vs 點擊按鈕時播放

| 比較 | 自動播放 | 點擊觸發 |
|------|---------|---------|
| 瀏覽器相容 | ❌ 被 autoplay policy 阻擋 | ✅ 使用者互動後可播放 |
| UX | 可能嚇到兒童 | 使用者主動觸發，體驗自然 |
| 實作複雜度 | 需要額外 overlay 引導點擊 | 直接綁在按鈕上 |

**結論**: 選擇點擊「開始探險」時觸發播放。理由：
1. 瀏覽器 autoplay policy 要求使用者互動才能播放音訊
2. 「開始探險」本身就是第一個 user gesture，可以同時解鎖音訊 + 開始歡迎語音
3. 不需要額外的 overlay 或 "點擊開始" 畫面

## Out of Scope

- 角色圖片製作（HO-601）
- 背景音樂（本專案無此需求）
- 語音錄製（客戶提供 MP3）
- 進度追蹤 / localStorage 記錄（已確認不做）
