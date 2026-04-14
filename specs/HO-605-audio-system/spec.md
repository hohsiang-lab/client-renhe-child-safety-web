# Feature Specification: 語音播放系統

**Feature Branch**: `HO-605-audio-system`
**Created**: 2026-04-14
**Status**: Draft
**Input**: HO-605 — 設計統一的語音播放管理機制

> Informed by memory: 無相關歷史記錄（D008 為新專案）

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 頁面語音引導播放 (Priority: P1)

兒童進入互動模組頁面（秘密遊戲、身體紅綠燈、信任大人）後，系統自動播放語音指引，說明該模組的玩法。語音播完後，才啟用互動區域讓兒童操作。

**Why this priority**: 這是語音系統的核心場景。每個模組都需要語音引導，沒有這個功能，6-10 歲的兒童無法理解遊戲規則。

**Independent Test**: 進入任一模組頁面，語音自動播放，播完後互動元素從 disabled 變成 enabled。

**Acceptance Scenarios**:

1. **Given** 兒童從選單點進「秘密遊戲」頁面, **When** 頁面載入完成, **Then** 語音指引自動開始播放，互動卡片顯示為不可點擊狀態
2. **Given** 語音指引正在播放, **When** 語音播放完畢, **Then** 互動卡片變為可點擊狀態，並有視覺提示（如動畫或高亮）
3. **Given** 語音指引正在播放, **When** 兒童嘗試點擊互動元素, **Then** 互動不回應（防止亂按打斷流程）

---

### User Story 2 - 互動觸發語音回饋 (Priority: P1)

兒童在互動過程中點擊元素（如身體部位、秘密卡片），系統播放對應的語音回饋（解釋、鼓勵、提示）。

**Why this priority**: 與 P1 並列，因為語音回饋是互動的核心體驗。6-10 歲兒童需要聽覺回饋來理解內容。

**Independent Test**: 點擊身體紅綠燈的任一部位，播放對應語音說明。

**Acceptance Scenarios**:

1. **Given** 兒童在身體紅綠燈頁面, **When** 點擊「胸部」部位, **Then** 播放對應的語音解釋（紅燈語音）
2. **Given** 語音 A 正在播放, **When** 兒童點擊另一個部位觸發語音 B, **Then** 語音 A 立即停止，語音 B 開始播放（防止重疊）
3. **Given** 語音回饋播放中, **When** 語音播完, **Then** 可觸發下一步邏輯（例如自動跳到下一題、顯示下一步按鈕）

---

### User Story 3 - 全域靜音控制 (Priority: P2)

使用者（老師或家長協助操作時）可隨時切換靜音模式。靜音狀態跨頁面保持。

**Why this priority**: 教學場景中老師可能需要自己口頭解說，或在安靜環境使用。

**Independent Test**: 按下靜音按鈕，所有頁面的語音都不發出聲音；取消靜音後恢復。

**Acceptance Scenarios**:

1. **Given** 語音正在播放, **When** 按下靜音按鈕, **Then** 語音立即靜音（不停止播放，只是沒聲音），按鈕圖示切換為「已靜音」
2. **Given** 處於靜音模式, **When** 切換到另一個頁面, **Then** 靜音狀態維持
3. **Given** 處於靜音模式, **When** 按下取消靜音按鈕, **Then** 恢復音量，按鈕圖示切換回「有聲音」
4. **Given** 靜音模式下觸發自動播放語音, **When** 語音「播放」完畢（無聲）, **Then** onEnd callback 仍然正常觸發（流程不卡住）

---

### User Story 4 - MP3 資源預載 (Priority: P3)

進入模組頁面前，系統預先載入該模組需要的 MP3 檔案，避免播放時出現延遲。

**Why this priority**: 優化體驗，但不是 MVP 阻塞項。網路慢時才明顯感受差異。

**Independent Test**: 在模擬慢速網路下，預載後的語音播放無延遲。

**Acceptance Scenarios**:

1. **Given** 兒童在選單頁面, **When** 頁面載入, **Then** 預先載入即將進入的模組的 MP3 檔案
2. **Given** MP3 檔案尚未載入完成, **When** 觸發播放, **Then** 顯示載入指示（如 spinner），載入完成後自動播放

---

### Edge Cases

- **iOS Safari autoplay 限制**：iOS 要求至少一次使用者互動後才能播放音訊。首頁或選單頁需要設計一個「開始」按鈕，作為使用者的第一次互動，解鎖 AudioContext。
- **MP3 檔案載入失敗**：網路問題導致 MP3 無法載入時，不阻塞互動流程。語音播放失敗時直接觸發 onEnd，讓流程繼續。
- **快速連續點擊**：兒童可能快速連續點擊不同互動元素。系統應取消前一個語音、播放新的，不產生重疊或錯亂。
- **頁面切換中斷**：語音播放中兒童離開頁面（按返回或切換），語音應自動停止並清理資源。
- **多個 tab/視窗**：不需處理跨 tab 同步，單一 tab 使用場景。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系統 MUST 提供 `useAudioPlayer` hook，支援 play / pause / stop 三個操作
- **FR-002**: 系統 MUST 在同一時間只播放一個語音，新語音觸發時自動停止前一個（singleton 播放）
- **FR-003**: 系統 MUST 提供全域靜音切換功能，靜音狀態跨頁面維持（使用 React Context）
- **FR-004**: 系統 MUST 支援 `onEnd` callback，語音播完後觸發呼叫端指定的邏輯
- **FR-005**: 系統 MUST 在元件 unmount 時自動停止播放並清理資源
- **FR-006**: 系統 MUST 提供預載機制，允許提前載入指定 MP3 檔案
- **FR-007**: 系統 MUST 在靜音模式下仍正常執行播放流程（含 onEnd 觸發），僅靜音輸出
- **FR-008**: 系統 MUST 處理 iOS Safari autoplay 限制，在使用者互動後解鎖音訊播放能力
- **FR-009**: 系統 MUST 在 MP3 載入失敗時不阻塞互動流程，直接觸發 onEnd callback
- **FR-010**: 系統 MUST 提供 `isPlaying` 狀態，讓 UI 可據此控制互動元素的啟用/禁用

### Key Entities

- **AudioTrack**: 代表一個 MP3 資源，包含 src（路徑）、duration、loaded 狀態
- **AudioPlayerState**: 播放器狀態，包含 isPlaying、isMuted、currentSrc
- **AudioContext（React）**: 全域音訊狀態管理，提供 mute/unmute 控制和狀態共享

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 語音引導播放完畢後，互動元素在 200ms 內從禁用變為啟用
- **SC-002**: 靜音切換在任何頁面操作後，跨頁面保持一致
- **SC-003**: 快速連續點擊 3 個不同互動元素時，只播放最後一個的語音，無重疊
- **SC-004**: 頁面切換時，前一頁的語音在 100ms 內停止
- **SC-005**: MP3 載入失敗時，互動流程在 1 秒內繼續（不卡住）

## Assumptions

- MP3 檔案由客戶提供，命名規範已在 HO-602 制定完成
- 單一 tab 使用場景，不需處理跨 tab 同步
- 目標裝置為平板（iPad / Android tablet），瀏覽器為 Safari 和 Chrome
- 音訊檔案為語音旁白，非背景音樂，不需音量控制（只有靜音/非靜音）
- 專案使用 React 19 + Vite，不引入額外音訊 library（原生 HTML5 Audio API 足夠）

## Alternatives Considered

### 方案比較：原生 HTML5 Audio vs howler.js

| 比較項目 | HTML5 Audio API | howler.js |
|---------|----------------|-----------|
| Bundle size | 0 KB | ~30 KB |
| iOS Safari 支援 | 需手動處理 autoplay unlock | 內建處理 |
| 功能覆蓋 | 足夠（play/pause/stop/mute/onended） | 過多（spatial audio、sprite 等不需要） |
| 學習成本 | 無 | 低但不必要 |

**結論**: 選擇原生 HTML5 Audio API。理由：
1. 本專案音訊需求簡單（單檔播放、無混音、無空間音效），HTML5 Audio API 完全覆蓋
2. 零額外依賴，bundle size 更小（平板 + 可能慢網路環境）
3. 現有 `useAudio.ts` 已使用原生 API，擴充比換方案成本低
4. iOS autoplay unlock 只需 ~10 行 code 處理，不值得為此引入整個 library

### use-sound

Josh Comeau 的 `use-sound` 封裝 howler.js，設計目的是短音效（按鈕音效、通知音），不適合語音旁白場景（無 pause、有限的 onEnd 支援）。排除。

## Out of Scope

- 背景音樂播放（本專案無此需求）
- 音量大小調整（只有靜音/非靜音）
- 語音錄製或即時生成
- 跨 tab/視窗音訊同步
- 字幕/逐字稿同步顯示（如有需求另開 issue）
