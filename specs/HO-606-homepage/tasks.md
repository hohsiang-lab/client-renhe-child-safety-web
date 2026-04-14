# Implementation Tasks: HO-606 首頁開發

**Feature**: HO-606-homepage
**Created**: 2026-04-14
**Status**: Draft

## Tasks

### Chunk 1 — 語音整合 + 音檔

- [ ] T-001: 複製 `home-welcome.mp3` 從 `d008-spec/audio/` 到 worktree 的 `public/audio/`
- [ ] T-002: 修改 `HomePage.tsx`，引入 `useAudioPlayer`，在「開始探險」點擊時播放 `home-welcome.mp3` 並導航至 `/menu`

### Chunk 2 — UI 優化

- [ ] T-003: 優化首頁視覺設計（角色 placeholder、副標題、背景裝飾、按鈕樣式）
- [ ] T-004: 確保響應式排版正確（平板 ≥768px、手機 <600px、桌機 ≥1024px）

### Chunk 3 — 驗證

- [ ] T-005: 本機 `npm run dev` 確認首頁渲染正常、語音播放、導航到選單
- [ ] T-006: `npm run build` 確認無 TypeScript / build 錯誤
- [ ] T-007: `npm run lint` 確認 0 errors

## Acceptance Checklist

- [ ] 首頁顯示標題「保護自己大冒險」
- [ ] 角色圖片區域有合理 placeholder
- [ ] 「開始探險」按鈕可點擊，導航至 `/menu`
- [ ] 點擊「開始探險」時播放歡迎語音
- [ ] 在 768px 和 375px 寬度下排版正常
- [ ] lint 通過
- [ ] build 通過
