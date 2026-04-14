# Implementation Plan: 遊戲選單頁開發

**Feature**: HO-607-menu-page
**Created**: 2026-04-14
**Status**: Draft

## Overview

MenuPage.tsx 已有完整骨架（三張卡片、emoji、導航、動畫）。改動範圍小：加 hover/tap 互動感、返回按鈕、視覺微調。

## Implementation Strategy

增量修改 `src/pages/MenuPage.tsx`，不重寫。

## Changes

| 檔案 | 動作 | 說明 |
|------|------|------|
| `src/pages/MenuPage.tsx` | 修改 | 加 whileHover/whileTap、返回首頁連結、視覺優化 |

## Technical Details

1. 卡片加 `whileHover={{ scale: 1.03 }}` 和 `whileTap={{ scale: 0.97 }}` — 與 HO-606 按鈕風格一致
2. 頁面頂部加返回首頁連結（FR-006）
3. 確認 grid 響應式斷點正確（md:grid-cols-3 = 768px+）

## Dependencies

- HO-604 ✅ HO-605 ✅ HO-606 ✅
