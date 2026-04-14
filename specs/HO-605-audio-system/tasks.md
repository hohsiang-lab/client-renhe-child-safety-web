# Tasks: 語音播放系統

**Branch**: `HO-605-audio-system` | **Date**: 2026-04-14
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Phase 1: Setup

- [ ] T001 建立 `src/contexts/` 目錄
- [ ] T002 建立 `src/utils/` 目錄

## Phase 2: Foundational — AudioProvider 核心

- [ ] T003 實作 `src/contexts/AudioContext.tsx` — AudioProvider + useAudioContext hook
  - 全域狀態：isMuted (boolean), isUnlocked (boolean)
  - 全域方法：toggleMute(), unlock()
  - singleton ref：currentAudio (HTMLAudioElement | null)
  - iOS autoplay unlock：mount 時監聽 click/touchend，建立靜音 Audio 並 play()，成功後標記 isUnlocked 並移除 listener
- [ ] T004 修改 `src/App.tsx` — 用 AudioProvider 包住 Routes
- [ ] T005 刪除 `src/hooks/useAudio.ts` — 被新系統取代

## Phase 3: User Story 1+2 — useAudioPlayer hook（P1）

- [ ] T006 [US1][US2] 實作 `src/hooks/useAudioPlayer.ts`
  - API：`useAudioPlayer()` 回傳 `{ play, pause, stop, resume, isPlaying, currentSrc }`
  - `play(src: string, options?: { onEnd?: () => void })` — 停止前一個 singleton audio → 建立新 Audio → 設 muted 狀態 → play()
  - `pause()` — 暫停當前音訊
  - `stop()` — 停止 + reset currentTime
  - `resume()` — 從暫停處繼續
  - `isPlaying` — boolean 狀態
  - `currentSrc` — 當前播放的 src
  - play() 失敗時（catch）直接呼叫 onEnd（FR-009）
  - audio.onended 觸發 onEnd callback（FR-004）
  - 元件 unmount 時自動 stop + cleanup（FR-005）
  - 從 AudioContext 讀取 isMuted 並即時同步到 audio.muted

## Phase 4: User Story 3 — 全域靜音控制（P2）

- [ ] T007 [US3] 實作 `src/components/MuteButton.tsx`
  - 浮動按鈕，固定在畫面右下角
  - 使用 useAudioContext 讀取 isMuted + toggleMute
  - 靜音時顯示 🔇 圖示，非靜音顯示 🔊 圖示
  - Tailwind 樣式，圓形按鈕，z-index 確保在最上層

## Phase 5: User Story 4 — MP3 預載（P3）

- [ ] T008 [US4] 實作 `src/utils/preloadAudio.ts`
  - `preloadAudio(srcs: string[]): Promise<void[]>`
  - 對每個 src 建立 Audio 實例，設 preload = 'auto'
  - 監聽 canplaythrough 事件 resolve，error 事件也 resolve（不阻塞）
  - 預載的 Audio 實例不保留引用（瀏覽器快取會保留資源）

## Phase 6: Polish

- [ ] T009 確認所有頁面元件中沒有直接使用舊 `useAudio` 的地方（grep 確認）
- [ ] T010 在 dev server 上手動驗證：靜音切換、play/stop、頁面切換清理

## Dependencies

```
T001, T002 → T003 → T004, T005
                  → T006 → T007
                         → T008
T009, T010 最後執行
```

## Summary

- 總任務數：10
- Phase 2（核心）：3 tasks — AudioProvider + App 包裝 + 清理舊 hook
- Phase 3（hook）：1 task — useAudioPlayer
- Phase 4（UI）：1 task — MuteButton
- Phase 5（預載）：1 task — preloadAudio
- Phase 6（收尾）：2 tasks — 驗證 + 手動測試
- MVP scope：Phase 1-3（AudioProvider + useAudioPlayer）就能讓模組頁面使用
