# Implementation Plan: 語音播放系統

**Branch**: `HO-605-audio-system` | **Date**: 2026-04-14 | **Spec**: [spec.md](./spec.md)

## Summary

重構現有 `useAudio.ts` 為完整的語音播放系統。核心是一個 `AudioProvider`（React Context）管理全域狀態（靜音、singleton 播放），搭配 `useAudioPlayer` hook 讓各模組頁面使用。使用原生 HTML5 Audio API，不引入第三方 library。

## Technical Context

**Language/Version**: TypeScript 6.0 + React 19
**Primary Dependencies**: react, react-dom（已安裝）
**Storage**: N/A（純客戶端）
**Testing**: 無現有 test 框架（本 issue 為 hook/service 設計，E2E 測試隨各模組 issue 補）
**Target Platform**: iPad Safari, Android Chrome（平板優先）
**Project Type**: web (SPA, Vite)
**Performance Goals**: 語音切換 < 200ms，onEnd callback < 100ms
**Constraints**: iOS Safari autoplay 限制、零額外依賴、6-10 歲兒童操作

## Architecture Design

### 核心元件

```
AudioProvider (React Context)
├── 全域狀態：isMuted, isUnlocked (iOS autoplay)
├── 全域方法：toggleMute, unlock
└── singleton 管理：currentAudio ref

useAudioPlayer (custom hook)
├── 消費 AudioProvider context
├── 提供：play(src, onEnd?), pause(), stop(), resume()
├── 回傳：isPlaying, currentSrc
└── 自動 cleanup on unmount

preloadAudio (utility function)
├── 接受 src[]
├── 用 Audio.preload = 'auto' 預先載入
└── 回傳 Promise<void>

MuteButton (UI component)
├── 浮動按鈕，固定在畫面角落
├── 顯示靜音/非靜音圖示
└── 消費 AudioProvider
```

### Singleton 播放機制

```
play(src) 被呼叫
  ↓
context.currentAudio 有值？
  ├─ 是 → pause + reset 前一個
  └─ 否 → 繼續
  ↓
new Audio(src)
  ↓
isMuted？
  ├─ 是 → audio.muted = true（仍然播放，onended 會觸發）
  └─ 否 → audio.muted = false
  ↓
audio.play()
  ├─ 成功 → 設 isPlaying = true, currentSrc = src
  └─ 失敗 → 呼叫 onEnd callback（不阻塞流程）
  ↓
audio.onended → 呼叫 onEnd callback, 清理狀態
```

### iOS Autoplay Unlock 策略

在 `AudioProvider` mount 時，監聽第一次 `click` 或 `touchend` 事件：
1. 建立一個靜音的 Audio 實例並 play()
2. 標記 `isUnlocked = true`
3. 移除 listener

這個策略確保後續任何 `audio.play()` 呼叫都不會被 Safari 阻擋。
首頁的「開始探險」按鈕自然提供了這個 user gesture。

## Project Structure

### Source Code

```text
src/
├── contexts/
│   └── AudioContext.tsx          # AudioProvider + useAudioContext
├── hooks/
│   ├── useAudio.ts               # [刪除] 被 useAudioPlayer 取代
│   └── useAudioPlayer.ts         # 主 hook：play/pause/stop/resume + onEnd
├── utils/
│   └── preloadAudio.ts           # MP3 預載 utility
├── components/
│   └── MuteButton.tsx            # 全域靜音切換 UI
├── assets/audio/                 # MP3 檔案（客戶提供）
└── ...
```

### Documentation

```text
specs/HO-605-audio-system/
├── spec.md
├── plan.md              # 本檔
├── tasks.md             # 下一步
└── checklists/
    └── requirements.md
```

## File Changes Summary

| 操作 | 檔案 | 說明 |
|------|------|------|
| 新增 | `src/contexts/AudioContext.tsx` | Context Provider + 全域狀態 |
| 新增 | `src/hooks/useAudioPlayer.ts` | 主要 hook |
| 新增 | `src/utils/preloadAudio.ts` | 預載 utility |
| 新增 | `src/components/MuteButton.tsx` | 靜音按鈕 UI |
| 修改 | `src/App.tsx` | 包 AudioProvider |
| 刪除 | `src/hooks/useAudio.ts` | 被 useAudioPlayer 取代 |

## Risks & Mitigations

| 風險 | 影響 | 緩解 |
|------|------|------|
| iOS Safari autoplay unlock 時機不對 | 頁面語音不播放 | 首頁按鈕提供 gesture；AudioProvider 自動監聽 click/touchend |
| MP3 檔案過大導致載入慢 | 播放延遲 | preloadAudio 在前一頁就開始載入；載入失敗不阻塞流程 |
| 快速連續點擊造成狀態競爭 | 多個 Audio 同時播放 | singleton ref + stop-before-play 機制 |
