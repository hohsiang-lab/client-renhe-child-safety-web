# Feature Specification: 遊戲選單頁開發

**Feature Branch**: `HO-607-menu-page`
**Created**: 2026-04-14
**Status**: Draft
**Input**: HO-607 — 遊戲選單頁開發

> Informed by memory: 無相關歷史記錄

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 選擇遊戲模組 (Priority: P1)

兒童從首頁進入選單後，看到三個遊戲模組卡片，點擊任一卡片進入對應遊戲。

**Why this priority**: 選單是所有遊戲模組的入口，沒有它就無法進入任何遊戲。

**Independent Test**: 進入 `/menu`，點擊三張卡片分別跳轉至 `/secret-game`、`/body-traffic-light`、`/trusted-adult`。

**Acceptance Scenarios**:

1. **Given** 使用者在 `/menu`, **When** 頁面載入, **Then** 顯示三張遊戲卡片（秘密遊戲、身體紅綠燈、信任大人），各含圖示、標題、說明
2. **Given** 使用者在選單頁, **When** 點擊「秘密遊戲」卡片, **Then** 導航至 `/secret-game`
3. **Given** 使用者在選單頁, **When** 點擊「身體紅綠燈」卡片, **Then** 導航至 `/body-traffic-light`
4. **Given** 使用者在選單頁, **When** 點擊「信任大人」卡片, **Then** 導航至 `/trusted-adult`

---

### User Story 2 - 響應式卡片排版 (Priority: P2)

選單卡片在平板橫向顯示為三欄，手機直向顯示為單欄。

**Why this priority**: 平板是主要裝置，排版必須正確。

**Independent Test**: 切換瀏覽器寬度，768px 以上三欄，600px 以下單欄。

**Acceptance Scenarios**:

1. **Given** 平板橫向（≥768px）, **When** 載入選單, **Then** 卡片以三欄橫排顯示
2. **Given** 手機（<600px）, **When** 載入選單, **Then** 卡片以單欄直排顯示，每張全寬

---

### Edge Cases

- **從結尾頁返回**：兒童從 `/ending` 點「回去再玩一次」回到選單，頁面正常渲染
- **觸控目標**：每張卡片 touch target ≥ 48x48px
- **語音**：project spec §6.1 明確寫「選單頁：無語音」。issue 描述提到「導覽語音」但以 spec 為準，不實作語音。若需語音另開 issue。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 選單頁 MUST 顯示三張遊戲模組卡片
- **FR-002**: 每張卡片 MUST 包含模組圖示（emoji placeholder）、標題、簡短說明
- **FR-003**: 點擊卡片 MUST 導航至對應遊戲路由
- **FR-004**: 選單頁 MUST 有 Framer Motion 分段進場動畫
- **FR-005**: 選單頁 MUST 符合響應式設計（平板三欄、手機單欄）
- **FR-006**: 選單頁 MUST 有返回首頁的方式
- **FR-007**: 卡片 MUST 有 hover/tap 互動反饋

### Key Entities

- **MenuPage**: 選單頁元件，路由 `/menu`
- **GameModule**: 遊戲模組資料（name, description, path, emoji）

## Success Criteria *(mandatory)*

- **SC-001**: 三張卡片均可點擊跳轉至對應路由
- **SC-002**: 768px 以上三欄，600px 以下單欄
- **SC-003**: 每張卡片觸控目標 ≥ 48x48px

## Alternatives Considered

### 語音：加 vs 不加

issue 描述提到「導覽語音」，但 project spec §6.1 語音觸發規則表明確寫「選單頁：無語音」。以 spec 為準不加，避免與已確認的規格衝突。若客戶後續要求，另開 issue 處理。

## Out of Scope

- 選單頁語音（spec §6.1 明確排除）
- 遊戲模組圖片製作（HO-601）
- 遊戲模組實作（HO-608 / HO-609 / HO-610）
