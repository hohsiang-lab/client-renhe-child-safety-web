# HO-997 Tasks — 秘密遊戲圖片卡片 + 翻面動畫

## T001 — 資料層更新

- [x] 更新 `src/data/secrets.ts`：
  - `SecretQuestion` 新增 `frontImage: string`、`backImage: string`
  - 移除現有 8 題，替換為新 7 題情境
  - `scenario` / `explanation` 保留為 alt text

## T002 — SecretCard 組件

- [x] 建立 `src/components/SecretCard.tsx`：
  - Props: `question`, `viewed`, `onFlipped`, `onTrustedAdults`
  - 實作 CSS 3D flip（`perspective` + `preserve-3d` + `backface-visibility`）
  - 正面：`frontImage`，含已翻閱 badge
  - 背面：`backImage`，壞秘密顯示「誰是信任的大人？」按鈕
  - 點擊正面 → 翻至背面，觸發 `onFlipped(id)`
  - 點擊背面 → 翻回正面

## T003 — SecretGamePage 更新

- [x] 移除 `"select-type"` / `"card-detail"` phase，`Phase` 改為 `"intro" | "grid" | "trusted-adults"`
- [x] 移除 `selectedCard`、`selectedType` state、`openCard`、`closeCardToGrid` handlers
- [x] Grid phase：`<motion.button>` 文字卡片 → `<SecretCard>`
- [x] `viewedIds` 更新：由 SecretCard `onFlipped` callback 觸發
- [x] `openTrustedAdults` 改由 SecretCard 的 `onTrustedAdults` callback 觸發
- [x] `allViewed` 為 true 時才顯示「完成遊戲」按鈕

## T004 — 圖片資產

- [x] 建立 `public/images/secrets/` 目錄
- [x] 放入客戶提供 14 張圖片（q1-front.png ~ q7-back.png）
- [x] 圖片路徑與 `secrets.ts` 資料一致

> 圖片來源：Discord thread 1493484252174614710（Evan 提供，2026-04-29）

## T005 — E2E 測試

- [x] `e2e/secret-game.spec.ts`（覆寫 HO-608 舊版）：
  - intro 頁：好/壞秘密選擇按鈕顯示
  - 點選好/壞秘密 → 進 7 張卡片 grid
  - 翻面壞秘密卡片 → 顯示「誰是信任的大人？」CTA
  - 翻面好秘密卡片 → 不顯示 CTA
  - CTA → 信任大人頁面 →「我知道了」返回 grid
  - 翻閱所有 7 張 → 顯示「完成遊戲」按鈕
  - 完成按鈕點擊 → navigate to `/ending`
  - 從選單可進入秘密遊戲

## T006 — 行動裝置樣式確認

- [x] 翻面動畫 `WebKitBackfaceVisibility` + `backfaceVisibility` 雙重設定
- [x] 卡片以 `aspectRatio: "1414 / 2000"` 維持圖片比例
- [x] `loading="lazy"` 加到所有 SecretCard img
- [x] 跨裝置 E2E 測試通過（iPad / iPhone 14 / Pixel 7 / Desktop Safari）

## Pending（待客戶確認）

- [ ] 背面配音（若客戶確認）：翻至背面時播放 `/audio/secret-q{id}-hint.mp3`
