# Tasks: 語音播放系統

**Branch**: `HO-605-audio-system` | **Date**: 2026-04-14
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Phase 1: Setup

- [x] T001 建立 `src/contexts/` 目錄
- [x] T002 建立 `src/utils/` 目錄

## Phase 2: Foundational — AudioProvider 核心

- [x] T003 實作 `src/contexts/audio-context.ts` + `src/contexts/AudioProvider.tsx`
  - 全域狀態：isMuted (boolean)
  - 全域方法：toggleMute()
  - singleton ref：currentAudio (HTMLAudioElement | null)
  - iOS autoplay unlock：mount 時監聽 click/touchend，建立靜音 Audio 並 play()，成功後移除 listener
  - 備註：因 react-refresh lint 規則，context value 和 Provider component 分開兩個檔案
- [x] T004 修改 `src/App.tsx` — 用 AudioProvider 包住 Routes + 加入 MuteButton
- [x] T005 刪除 `src/hooks/useAudio.ts` — 被新系統取代

## Phase 3: User Story 1+2 — useAudioPlayer hook（P1）

- [x] T006 [US1][US2] 實作 `src/hooks/useAudioPlayer.ts` + `src/hooks/useAudioContext.ts`
  - API：`useAudioPlayer()` 回傳 `{ play, pause, stop, resume, isPlaying, currentSrc }`
  - `play(src: string, options?: { onEnd?: () => void })` — singleton stop-before-play
  - play() 失敗時直接呼叫 onEnd（FR-009）
  - audio.onended 觸發 onEnd callback（FR-004）
  - 元件 unmount 時自動 cleanup（FR-005）
  - 即時同步 isMuted 到 audio.muted

## Phase 4: User Story 3 — 全域靜音控制（P2）

- [x] T007 [US3] 實作 `src/components/MuteButton.tsx`
  - 浮動按鈕，固定在畫面右下角
  - 靜音 🔇 / 非靜音 🔊 切換

## Phase 5: User Story 4 — MP3 預載（P3）

- [x] T008 [US4] 實作 `src/utils/preloadAudio.ts`
  - `preloadAudio(srcs: string[]): Promise<void[]>`
  - error 也 resolve（不阻塞）

## Phase 6: Polish

- [x] T009 grep 確認無舊 `useAudio` 殘留
- [x] T010 tsc + eslint 全過

## Dependencies

```
T001, T002 → T003 → T004, T005
                  → T006 → T007
                         → T008
T009, T010 最後執行
```

## Summary

- 總任務數：10 — 全部完成
- 檔案結構因 react-refresh 規則調整：context value 和 Provider 分開
- tsc + eslint 零錯誤
