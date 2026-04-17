# Task List: 身體紅綠燈 v2 — 身體標記互動

**Feature Branch**: `HO-775-btl-v2-body-mark`
**Based on Plan**: `specs/HO-775-btl-v2-body-mark/plan.md`

---

## T001 — 建立 `src/data/bodyPartsV2.ts`

- [ ] 定義 `BodyPartZone`、`BodyPartV2` interface
- [ ] 建立 `bodyPartsV2` 陣列（10 個部位，含 sima-estimated 座標）
- [ ] 確認座標已加上 `// sima-estimated` 標記供 Evan 識別

**Acceptance**: `bodyPartsV2.length === 10`，雙邊部位（shoulder/hand/thigh）的 `zones.length === 2`

---

## T002 — 建立 `BodyMarkPage.tsx` 基礎架構

- [ ] 建立 `src/pages/BodyMarkPage.tsx`
- [ ] 從 URL search params 讀取 `?doll=female|male`，invalid 值 fallback `female`
- [ ] 初始化 state：`marks`（Map）、`selectedPartId`（string | null）
- [ ] 顯示標題文字（「幫身體各部位選燈色 🚦」）
- [ ] 顯示 PNG 圖片（`/images/doll-female.png` 或 `doll-male.png`），`max-w-[360px]`，`mx-auto`

**Acceptance**: 頁面可載入，圖片正確顯示，無 console error

---

## T003 — 實作 Hit Area 疊加層

- [ ] 圖片容器設為 `position: relative`
- [ ] 依 `bodyPartsV2` 生成透明 `<button>` 疊加在圖片上
- [ ] 雙邊部位（2 個 zone）各生成獨立 button，onClick 皆呼叫同一 partId
- [ ] Hit area 視覺：未標記輪廓圓 / 選中白色半透明 / 已標記燈色半透明
- [ ] 每個 button 加上 `aria-label={part.name}`、`data-part-id={part.id}`
- [ ] 確認 minWidth/minHeight ≥ 48px

**Acceptance**:
- 點擊 `[aria-label="私密處"]` → `selectedPartId === 'private'`
- 雙邊部位（肩膀）兩個 button 都可點擊，且點擊後 partId 相同

---

## T004 — 實作底部顏色選擇器

- [ ] 建立固定底部顏色選擇器（fixed bottom bar）
- [ ] 三個顏色按鈕：🟢 綠燈 / 🟡 黃燈 / 🔴 紅燈
- [ ] `handleColorPick(color)` 邏輯：selectedPartId 存在時更新 marks
- [ ] 無選中部位時點顏色按鈕無動作
- [ ] 已選部位有燈色時，對應按鈕顯示 active 狀態（scale + shadow）

**Acceptance**:
- 選中部位 → 點🔴 → marks.get(partId) === 'red'
- 無選中部位 → 點🟢 → marks 不變

---

## T005 — 實作「完成設定」按鈕與導航

- [ ] `isComplete = marks.size === bodyPartsV2.length` 計算
- [ ] 以 `AnimatePresence` + `motion.div` 讓「完成設定」按鈕在 isComplete 時從底部滑入
- [ ] 「完成設定」出現後，顏色選擇器仍可使用（可繼續修改）
- [ ] 點擊「完成設定」→ `navigate('/body-traffic-light')` (placeholder until Phase 4 spec)

**Acceptance**:
- 9/10 標記時無「完成設定」
- 第 10 個標記後按鈕出現（Framer Motion 動畫）
- 修改已標記部位後「完成設定」仍可見
- 點擊後導航發生

---

## T006 — 新增 Route 至 `src/App.tsx`

- [ ] import `BodyMarkPage`
- [ ] 在 `/body-traffic-light/pick-doll` 後加入 `<Route path="/body-traffic-light/mark" element={<BodyMarkPage />} />`

**Acceptance**: 直接訪問 `/body-traffic-light/mark?doll=female` 可看到頁面

---

## T007 — 撰寫 E2E 測試 `e2e/body-mark.spec.ts`

- [ ] 測試 1：`?doll=female` → img src 含 `doll-female.png`
- [ ] 測試 2：`?doll=male` → img src 含 `doll-male.png`
- [ ] 測試 3：無 param → fallback female
- [ ] 測試 4：點擊 `[aria-label="私密處"]` → 驗證選中狀態
- [ ] 測試 5：選中後點🔴 → 驗證 data-color 屬性或 class 變化
- [ ] 測試 6：標記全部 10 個部位 → 「完成設定」按鈕出現
- [ ] 測試 7：點「完成設定」→ URL 變更

**Acceptance**: 所有測試在本地跑通，無 flaky test
