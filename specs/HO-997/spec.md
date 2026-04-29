# HO-997 Spec — 秘密遊戲模組：好秘密/壞秘密卡片改用圖片 + 翻面顯示提示內容

## 1. 背景

HO-608 / HO-848 的秘密遊戲模組（`SecretGamePage.tsx`）目前使用文字卡片 + modal overlay 呈現情境與解說。
客戶要求改版為：**圖片卡片 + 點擊翻面（card flip）+ 翻面顯示提示圖片**。

## 2. 情境資料（7 題，取代現有 8 題）

| # | 情境（正面） | 類型 | 提示（背面） |
|---|---|---|---|
| 1 | 媽媽生日快到了，我們偷偷做卡片給她 | 好秘密 | 是開心的秘密，對別人不會有傷害 |
| 2 | 有人說摸他一下給我禮物，但不能說這個秘密 | 壞秘密 | 這是危險行為，請馬上告訴信任的大人 |
| 3 | 有人傳奇怪的照片給我，說這是我們的秘密 | 壞秘密 | 當有人讓你不舒服，請立即告訴信任的大人 |
| 4 | 一起偷偷準備禮物給朋友，因為要給他驚喜 | 好秘密 | 正常的友誼互動，沒壓力也不會感到害怕 |
| 5 | 有人找我玩醫生遊戲，說不能跟爸爸媽媽說 | 壞秘密 | 有壓力的秘密 + 害怕，要立刻告訴信任的大人 |
| 6 | 朋友跟我說一起準備，給另一個朋友生日驚喜 | 好秘密 | 這是快樂、短暫的秘密，沒有讓你不舒服或害怕 |
| 7 | 網友說這是我們的秘密，不能讓你爸媽知道 | 壞秘密 | 不隨便透漏個資給網路認識的朋友 |

3 好秘密 + 4 壞秘密。

## 3. 功能需求（FR）

### FR-1：圖片卡片（grid 頁）
- 每張卡片以**客戶提供的情境圖片**（正面）取代現有文字區塊
- 圖片路徑規範：`/images/secrets/q{id}-front.png`
- 卡片大小：全圖覆蓋，保持 `aspect-ratio: 1/1` 或依圖片比例決定
- 已翻閱過的卡片顯示視覺標示（例如半透明 overlay + ✅ icon）

### FR-2：翻面動畫（card flip）
- 點擊卡片後執行 CSS 3D flip 動畫（`rotateY`）
- 翻面時長建議：300–400ms，`ease-in-out`
- 使用 `perspective` + `transform-style: preserve-3d` 實作
- 不使用 framer-motion 3D（現有 framer-motion 保留給 page-level 動畫）

### FR-3：翻面後顯示提示圖片（背面）
- 背面顯示**客戶提供的提示圖片**
- 圖片路徑規範：`/images/secrets/q{id}-back.png`
- 背面需包含：
  - 提示圖片（主要內容）
  - 對於**壞秘密**，顯示「告訴信任的大人」CTA 按鈕，點擊進入 trusted-adults 頁面
- 背面可再次點擊翻回正面（允許重翻）

### FR-4：資料結構更新
- `SecretQuestion` interface 新增 `frontImage: string`、`backImage: string`
- 將 `scenario`、`explanation` 保留作為圖片的 `alt` text（無障礙）
- `secretQuestions` 資料更新為 7 題新情境

### FR-5：完成判定
- 所有 7 張卡片至少翻閱一次 → `allViewed` = true → 顯示「完成」按鈕
- 完成後導航至 `/ending`（維持現有邏輯）

### FR-6：Trusted Adults 流程
- 壞秘密背面的 CTA 按鈕點擊後進入 `trusted-adults` phase（現有實作）
- 邏輯不變，只是觸發點從 modal 內按鈕改為背面卡片按鈕

## 4. 暫不確認項目（Pending）

| 項目 | 狀態 | 影響 |
|---|---|---|
| 背面配音（audio narration） | 待客戶確認 | 若有，需在翻面後播放 `/audio/secret-q{id}-hint.mp3` |
| 圖片檔案命名規範 | 待客戶提供 | 暫定 `q{id}-front.png` / `q{id}-back.png` |
| 卡片比例（aspect ratio） | 待確認 | 依圖片決定，暫定 3:4 或 1:1 |

## 5. Out of Scope

- Intro 頁面（保持現有文字 + emoji 樣式）
- Trusted Adults 頁面內容（無變更）
- 結尾頁（`/ending`）
- 音效（intro / grid page）

## 6. 非功能需求

- 翻面動畫在 iOS Safari 16+ / Chrome Android 正常運作
- 圖片使用 `loading="lazy"` 避免一次載入全部 7×2=14 張
- 無障礙：所有圖片需有正確 `alt` 屬性

## 7. 完成條件（Acceptance Criteria）

1. [ ] 7 張卡片以正面圖片顯示於 grid
2. [ ] 點擊任意卡片觸發翻面動畫（rotateY 300ms）
3. [ ] 翻面後顯示對應背面提示圖片
4. [ ] 壞秘密背面有「告訴信任的大人」CTA
5. [ ] 已翻閱卡片有視覺標示
6. [ ] 所有 7 張翻閱後顯示「完成」按鈕
7. [ ] 原有 trusted-adults 流程不受影響
8. [ ] 翻面動畫在行動裝置正常
