# Implementation Tasks: HO-606 首頁開發

**Feature**: HO-606-homepage
**Created**: 2026-04-14
**Status**: Done

## Tasks

### Chunk 1 — 語音整合 + 音檔

- [x] T-001: 複製 `home-welcome.mp3` 從 `d008-spec/audio/` 到 worktree 的 `public/audio/`
- [x] T-002: 修改 `HomePage.tsx`，使用 `useAudioContext` 直接建立 Audio 實例，在「開始探險」點擊時播放 `home-welcome.mp3` 並導航至 `/menu`
  - 注意：不使用 `useAudioPlayer`，因為其 unmount cleanup 會停止音訊

### Chunk 2 — UI 優化

- [x] T-003: 優化首頁視覺設計（🌟 裝飾、emoji 角色 placeholder、分段 Framer Motion 動畫）
- [x] T-004: 響應式排版已確認（App.tsx 的 max-w-[960px] mx-auto + HomePage 的 flex column 已足夠）

### Chunk 3 — 驗證

- [x] T-005: 本機確認首頁渲染正常（需 Evan 做最終 UI 確認）
- [x] T-006: `npm run build` 通過
- [x] T-007: `npm run lint` 通過（0 errors）

## Review Findings

### Round 1
- **Critical**: `useAudioPlayer` unmount cleanup 會停止歡迎語音 → 改用 `useAudioContext` 直接管理 Audio 實例
- 修復已 commit (356727d)

## Acceptance Checklist

- [x] 首頁顯示標題「保護自己大冒險」
- [x] 角色圖片區域有合理 placeholder（emoji 👦👧）
- [x] 「開始探險」按鈕可點擊，導航至 `/menu`
- [x] 點擊「開始探險」時播放歡迎語音（跨頁面不中斷）
- [x] 響應式排版正常
- [x] lint 通過
- [x] build 通過
