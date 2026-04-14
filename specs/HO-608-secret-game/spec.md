# Feature Specification: 秘密遊戲模組 — 好秘密/壞秘密辨識

**Feature Branch**: `HO-608-secret-game`
**Created**: 2026-04-14
**Status**: Draft
**Input**: HO-608 — [D008] 秘密遊戲模組

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 完成秘密遊戲 (Priority: P1)

兒童從選單進入秘密遊戲，依序回答 6 題隨機排序的情境題，判斷「好秘密」或「壞秘密」，答對看星星動畫自動進下題，答錯看解說按「我知道了」進下題，全部完成後顯示成績並導向結尾頁。

**Why this priority**: 這是三個遊戲模組之一的核心玩法，沒有它選單的「秘密遊戲」卡片就是死連結。

**Independent Test**: 進入 `/secret-game`，回答 6 題，驗證分數正確，點完成跳轉至 `/ending`。

**Acceptance Scenarios**:

1. **Given** 使用者在 `/secret-game`, **When** 頁面載入, **Then** 顯示第 1 題情境文字、進度 (1/6)、兩個答案按鈕（好秘密 / 壞秘密）
2. **Given** 使用者看到情境, **When** 點擊正確答案, **Then** 顯示星星動畫 + 鼓勵文字，2 秒後自動進入下一題
3. **Given** 使用者看到情境, **When** 點擊錯誤答案, **Then** 顯示解說文字 + 「我知道了」按鈕，點擊後進入下一題
4. **Given** 使用者完成第 6 題, **When** 回饋結束, **Then** 顯示完成畫面（答對數/6）+ 「完成」按鈕導向 `/ending`

---

### User Story 2 - 音效回饋 (Priority: P3)

每題載入時播放情境語音，答對播放正確音效，答錯播放錯誤音效。

**Why this priority**: 音檔由 HO-612 交付，尚未就緒。useAudioPlayer.onerror 會呼叫 onEnd，缺檔不阻塞遊戲流程。

**Independent Test**: 放入任一 MP3 至 `public/audio/secret-q1-scenario.mp3`，確認播放；移除後確認遊戲仍正常運作。

---

### Edge Cases

- **全對 / 全錯**：完成畫面分別顯示 6/6 與 0/6，均可正常跳轉
- **觸控目標**：答案按鈕 ≥ 48x48px
- **題目順序**：每次進入頁面隨機洗牌，但同一輪內不重複

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 頁面 MUST 從 `secretQuestions` 隨機排序後依序出題
- **FR-002**: 每題 MUST 顯示情境文字、進度 (N/6)、兩個按鈕（好秘密 / 壞秘密）
- **FR-003**: 答對 MUST 顯示星星動畫 + 鼓勵文字，2 秒後自動進下題
- **FR-004**: 答錯 MUST 顯示解說文字 + 「我知道了」按鈕，點擊後進下題
- **FR-005**: 完成 6 題後 MUST 顯示答對數 + 完成按鈕導向 `/ending`
- **FR-006**: 每題情境載入 SHOULD 播放語音（graceful degrade：缺檔不阻塞）
- **FR-007**: 答對/答錯 SHOULD 播放對應音效（graceful degrade）
- **FR-008**: 所有按鈕 MUST 有 Framer Motion 互動反饋（whileHover/whileTap）

### Key Entities

- **SecretGamePage**: 遊戲頁元件，路由 `/secret-game`
- **SecretQuestion**: 資料型別（id, scenario, answer, explanation），定義於 `src/data/secrets.ts`

## Success Criteria *(mandatory)*

- **SC-001**: 6 題均可正確判定答對/答錯，分數正確
- **SC-002**: 答對自動進下題（~2s），答錯需手動確認
- **SC-003**: 完成後跳轉 `/ending`
- **SC-004**: lint + build 零錯誤

## Dependencies

- `src/data/secrets.ts` ✅ 已就緒
- `src/hooks/useAudioPlayer.ts` ✅ 已就緒
- 音檔 `public/audio/secret-*.mp3` — HO-612 交付（graceful degrade）
- 情境插圖 — HO-601 交付（目前用 emoji placeholder）

## Out of Scope

- 音檔製作（HO-612）
- 情境插圖製作（HO-601）
- 其他遊戲模組（HO-609 / HO-610）
