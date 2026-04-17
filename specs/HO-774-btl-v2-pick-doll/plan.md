# Implementation Plan: HO-774 人偶選擇頁

## Approach

1. 建立 `public/images/` 目錄，放置 placeholder SVG（暫代 PNG）
2. 建立 `src/pages/PickDollPage.tsx`
   - state: `selectedDoll: 'female' | 'male' | null`
   - 兩個 DollCard（用 `<button>` wrap）
   - ring highlight on selected
   - disabled "選好了" until selection
   - navigate to `/body-traffic-light/mark?doll=<choice>`
3. 修改 `src/App.tsx`：加入 `<Route path="/body-traffic-light/pick-doll" element={<PickDollPage />} />`
4. 建立 `e2e/pick-doll.spec.ts` E2E 測試

## Component Structure

```tsx
PickDollPage
  ├── h1: 選一個你喜歡的人偶
  ├── div.grid-cols-2
  │   ├── DollCard (female) — button with img + label + ring on selected
  │   └── DollCard (male)
  └── button: 選好了 (disabled if !selectedDoll)
```

## Image Placeholders

`public/images/` 放兩個 SVG 作為 placeholder：
- `doll-female.svg` — 簡單 SVG 人偶（粉色系）
- `doll-male.svg` — 簡單 SVG 人偶（藍色系）

客戶 PNG 到位後直接替換（或 Evan 直接放 PNG，code 改 src 路徑）。

實際上，為保持最大兼容性，`<img>` src 指向 `/images/doll-female.png`，Evan 將實際 PNG 複製過來即可。目前 404 OK，頁面不崩潰（alt text 顯示）。

## Routing

Phase 3 路由暫定 `/body-traffic-light/mark`，Phase 3 issue 實作時才建立 Route。
`PickDollPage` 的 navigate 直接寫死，Phase 3 建立後自然 work。
