# Feature Specification: 身體紅綠燈模組 — SVG 人形互動

**Feature Branch**: `HO-609-body-traffic-light`
**Created**: 2026-04-14
**Status**: Draft
**Input**: HO-609 — [D008] 身體紅綠燈模組 — SVG 人形互動

> Informed by memory: 無相關歷史記錄（D008 為新專案）

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 自由探索身體紅綠燈 (Priority: P1)

兒童從選單進入身體紅綠燈頁面，看到一個簡化的 SVG 人形圖，6 個身體部位（頭、胸、手、私密處、腿、腳）以互動區域標示。兒童可自由點擊任意部位，點擊後該部位顯示紅燈（私密部位：胸、私密處）或綠燈（一般部位：頭、手、腿、腳），同時播放該部位的語音說明，畫面顯示對應的提示文字。

**Why this priority**: 這是模組的核心玩法。沒有人形互動，整個頁面就是空殼。自由探索模式比逐題模式更適合「身體界線認知」的教學目標 — 小朋友可以反覆點擊、自主學習。

**Independent Test**: 進入 `/body-traffic-light`，點擊任一部位，驗證紅/綠燈顏色回饋 + 文字說明 + 語音播放。

**Acceptance Scenarios**:

1. **Given** 使用者在 `/body-traffic-light`, **When** 頁面載入, **Then** 顯示標題「身體紅綠燈」+ SVG 人形圖 + 6 個可點擊部位 + 引導文字
2. **Given** SVG 人形已顯示, **When** 點擊綠燈部位（頭/手/腿/腳）, **Then** 該部位以綠色高亮 + 顯示綠燈圖示 + 顯示說明文字 + 播放語音
3. **Given** SVG 人形已顯示, **When** 點擊紅燈部位（胸/私密處）, **Then** 該部位以紅色高亮 + 顯示紅燈圖示 + 顯示說明文字 + 播放語音
4. **Given** 已點擊某部位, **When** 點擊另一個部位, **Then** 前一個部位回復預設色，新部位高亮 + 更新文字 + 播放新語音（停止舊語音）

---

### User Story 2 - 完成所有部位後跳轉 (Priority: P1)

兒童點擊完全部 6 個部位後，顯示完成畫面（鼓勵文字 + 進度 6/6），提供按鈕導向結尾頁或下一個遊戲。

**Why this priority**: 教學目標要求兒童認識所有 6 個部位，完成判定是流程閉環的必要條件。

**Independent Test**: 點擊完 6 個部位，驗證完成畫面出現，點擊按鈕可跳轉至 `/ending`。

**Acceptance Scenarios**:

1. **Given** 使用者已點擊 5 個部位, **When** 點擊第 6 個（最後一個）部位, **Then** 先顯示該部位的紅/綠燈回饋，然後自動切換至完成畫面
2. **Given** 完成畫面顯示, **When** 使用者查看, **Then** 顯示鼓勵文字 + 已探索數 (6/6) + 播放 `body-complete.mp3` + 「繼續」按鈕
3. **Given** 完成畫面顯示, **When** 點擊「繼續」按鈕, **Then** 導向 `/ending`

---

### User Story 3 - 語音回饋 (Priority: P2)

每個部位點擊時播放對應語音（`body-{partId}.mp3`），完成全部時播放 `body-complete.mp3`。語音使用現有 `useAudioPlayer` hook。

**Why this priority**: 語音是核心教學體驗的一部分，但語音載入失敗不應阻塞互動流程（graceful degrade）。

**Independent Test**: 放入 `body-head.mp3` 至 `public/audio/`，點擊頭部，確認語音播放；移除檔案後確認互動仍正常。

**Acceptance Scenarios**:

1. **Given** 語音檔存在, **When** 點擊部位, **Then** 播放 `body-{partId}.mp3`
2. **Given** 語音正在播放, **When** 點擊另一部位, **Then** 停止前一個語音，播放新語音
3. **Given** 語音檔不存在, **When** 點擊部位, **Then** 視覺回饋正常，不報錯

---

### Edge Cases

- **重複點擊同一部位**：不重複計入已探索數，但重新播放語音和顯示說明
- **快速連續點擊不同部位**：前一個語音停止，只播放最新點擊的部位
- **觸控目標**：所有 SVG 部位 hitbox ≥ 48x48px（平板觸控友好）
- **語音全部載入失敗**：視覺回饋（顏色 + 文字）仍完整運作，完成流程不受影響
- **從選單直接返回再進入**：已探索狀態重置，可重新遊玩

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 頁面 MUST 顯示簡化 SVG 人形圖，包含 6 個可點擊部位區域
- **FR-002**: 每個部位 MUST 在點擊後根據 `signal` 屬性顯示對應顏色（green → 綠色高亮, red → 紅色高亮）
- **FR-003**: 每個部位點擊後 MUST 顯示部位名稱 + 說明文字（來自 `bodyParts.ts`）
- **FR-004**: 頁面 MUST 追蹤已探索的部位數，顯示進度（N/6）
- **FR-005**: 全部 6 個部位探索完畢後 MUST 顯示完成畫面 + 導向 `/ending` 的按鈕
- **FR-006**: 每個部位點擊 SHOULD 播放 `body-{partId}.mp3` 語音（graceful degrade：缺檔不阻塞）
- **FR-007**: 完成時 SHOULD 播放 `body-complete.mp3`
- **FR-008**: SVG 部位 MUST 有 Framer Motion 動畫回饋（點擊時 scale 變化 + 顏色漸變）
- **FR-009**: 所有觸控目標 MUST ≥ 48x48px
- **FR-010**: 頁面 MUST 響應式適配（手機 / 平板 / 桌面）

### Key Entities

- **BodyTrafficLightPage**: 遊戲頁元件，路由 `/body-traffic-light`
- **BodyPart**: 資料型別（id, name, signal, description），定義於 `src/data/bodyParts.ts`（已存在）
- **BodySvg**: SVG 人形元件，包含 6 個可點擊區域

## Success Criteria *(mandatory)*

- **SC-001**: 6 個部位均可點擊，紅/綠燈顯示正確
- **SC-002**: 已探索進度正確追蹤（不重複計數）
- **SC-003**: 全部探索後跳轉 `/ending` 正常
- **SC-004**: 語音播放正常（有檔案時），缺檔時不阻塞
- **SC-005**: lint + build 零錯誤
- **SC-006**: E2E 測試覆蓋核心場景（點擊 → 回饋 → 完成 → 跳轉）

## Alternatives Considered

### SVG 實作方式
- **選項 A（選用）: 程式碼內建 SVG** — React 元件內直接寫 SVG path，每個部位用 `<g>` 或 `<path>` 包裝成可點擊區域。優點：不需外部檔案、hitbox 精準可控、方便套 Framer Motion 動畫。
- **選項 B: SVG 檔案引入** — 用 `.svg` 檔匯入。缺點：Vite 的 SVG 元件化需額外 plugin，且 hitbox 調整不方便。
- **選項 C: CSS/HTML Image Map** — 用 `<map>` + `<area>`。缺點：不支援動畫、響應式困難、不符現有 tech stack。

選 A 因為：與現有 React + Framer Motion 架構一致，hitbox 可精確控制觸控大小，不需額外依賴。

### 互動模式
- **選項 A（選用）: 自由探索** — 所有部位一次顯示，使用者可自由點擊任意順序。
- **選項 B: 逐題順序** — 像秘密遊戲一樣，一次顯示一個部位。

選 A 因為：owner 確認偏好自由探索模式，更符合「認識身體」的教學直覺。

## Dependencies

- `src/data/bodyParts.ts` ✅ 已就緒（6 個部位定義）
- `src/hooks/useAudioPlayer.ts` ✅ 已就緒
- 音檔 `d008-spec/audio/body-*.mp3` ✅ 已就緒（需複製至 `public/audio/`）
- SVG 人形：HO-609 自行實作（程式碼內建）

## Out of Scope

- 其他遊戲模組（HO-608 / HO-610）
- 音檔製作（已由客戶提供）
- AI 生成插圖（另案處理）
- 多語系支援
