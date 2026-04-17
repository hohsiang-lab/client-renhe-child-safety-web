# Feature Specification: 身體紅綠燈 v2 — 身體標記互動

**Feature Branch**: `HO-775-btl-v2-body-mark`
**Created**: 2026-04-17
**Status**: Draft
**Input**: HO-775 — [D008] 身體紅綠燈 v2 — 身體標記互動（小朋友自選燈色）
**Parent**: HO-772 — 身體紅綠燈 v2 流程重設計

## Context

Phase 3 of BTL v2 flow. Previous page (Phase 2) is `PickDollPage` at `/body-traffic-light/pick-doll`, which navigates here via `navigate(\`/body-traffic-light/mark?doll=\${selected}\`)`.

Full flow: 規則說明 → 選人偶 → **身體標記** → 觸碰測試 → 結尾

v1 (`BodyTrafficLightPage`) 預先設定每個部位的紅/綠燈。v2 改為讓兒童自己選擇每個部位的燈色（🟢/🟡/🔴），藉此引導思考與討論。

## Functional Requirements

### FR-001: 顯示已選人偶 PNG
- 從 URL query param `?doll=female|male` 讀取人偶選擇
- 顯示對應 PNG：`/images/doll-female.png` 或 `/images/doll-male.png`
- 圖片等比例顯示，最大寬度 360px，水平置中
- 若 `doll` param 缺失或無效，fallback 至 `female`

### FR-002: 身體部位點擊區（透明 hit area）
- 在 PNG 圖片上用 `position: absolute` 透明 `<button>` 疊加各部位 hit area
- Hit area 以 **佔 PNG 顯示尺寸的 %** 定位（非 px），確保不同螢幕尺寸一致
- 每個 hit area 最小 48×48px（tablet 觸控標準）
- 部位 ID 清單（共 10 個）：`head`、`face`、`ear`、`mouth`、`shoulder`、`chest`、`hand`、`belly`、`private`、`thigh`
- 雙邊部位（`shoulder`、`hand`、`thigh`）有 2 個 zone（左/右），共用同一個 partId

### FR-003: 部位選中狀態
- 點擊 hit area → 該部位進入「選中」狀態（視覺高亮：半透明白色圓圈 + border）
- 同一時間只能選中一個部位
- 已有燈色的部位可以被再次選中（以修改燈色）
- 點擊已選中的同一部位不取消選中（維持選中）

### FR-004: 底部顏色選擇器（固定在畫面底部）
- 三個顏色按鈕固定顯示：🟢 綠燈 / 🟡 黃燈 / 🔴 紅燈
- 點擊顏色按鈕時：
  - 若有選中部位 → 將該部位設為點擊的顏色，部位維持選中
  - 若無選中部位 → 無動作（按鈕仍可見但不做事）
- 目前選中顏色的按鈕顯示 active 狀態（若該部位已有燈色）

### FR-005: 燈色標記顯示
- 已標記的部位 hit area 顯示對應顏色的圓圈（🟢/🟡/🔴 色系 + 50% 透明度）
- 圓圈疊加在 PNG 之上，大小固定（約 32px）
- 未標記的部位 hit area 顯示小型無色圓圈（outline only）作為引導提示

### FR-006: 完成偵測與「完成設定」按鈕
- 所有 10 個部位都標記後，「完成設定」按鈕從底部顏色選擇器上方出現（Framer Motion 向上滑入）
- 「完成設定」出現後，仍可繼續修改任何部位的燈色
- 點擊「完成設定」→ 進入觸碰測試頁（路由 TBD，本 issue out of scope）
  - 暫時 navigate to `/body-traffic-light`（v1）作為 placeholder

## Technical Decisions

### PNG + 透明 hit area 疊加方式
- 圖片容器：`position: relative; width: 100%; max-width: 360px`
- Hit area button：`position: absolute; transform: translate(-50%, -50%); left: {cx}%; top: {cy}%`
- Width/height 使用 `w-[{w}%]` 搭配 `aspect-square` 或明確 h，最小 48px
- 透明 button 上方 overlay 一個 div 顯示燈色圓圈

### 座標系統
- 所有座標（`cx`、`cy`、`w`、`h`）以 **佔 PNG 顯示寬/高的 %** 表示（0–100）
- 原始 PNG 尺寸：2268 × 6047px（女/男均相同）
- 下方座標為 **sima 目測估算（Option B）**，Evan 需視覺驗證並調整

### 座標估算表（sima-estimated，待 Evan 調整）

| partId   | 名稱   | zones（cx / cy / w / h，均為 %）                        |
|----------|--------|--------------------------------------------------------|
| head     | 頭/頭髮 | `[{ cx:50, cy:22, w:22, h:10 }]`                      |
| face     | 臉     | `[{ cx:50, cy:26, w:15, h:9 }]`                       |
| ear      | 耳朵   | `[{ cx:37, cy:25, w:9, h:7 }]`（人偶右耳，畫面左側）    |
| mouth    | 嘴巴   | `[{ cx:50, cy:29, w:11, h:5 }]`                       |
| shoulder | 肩膀   | `[{ cx:28, cy:35, w:12, h:8 }, { cx:72, cy:35, w:12, h:8 }]` |
| chest    | 胸部   | `[{ cx:50, cy:40, w:22, h:9 }]`                       |
| hand     | 手/手臂 | `[{ cx:19, cy:46, w:12, h:13 }, { cx:81, cy:46, w:12, h:13 }]` |
| belly    | 肚子   | `[{ cx:50, cy:51, w:22, h:8 }]`                       |
| private  | 私密處  | `[{ cx:50, cy:58, w:20, h:8 }]`                       |
| thigh    | 大腿   | `[{ cx:40, cy:64, w:13, h:10 }, { cx:60, cy:64, w:13, h:10 }]` |

> **注意**：女生人偶（細長）與男生人偶（圓胖）比例不同，若視覺誤差 >3% 需建立各別座標表。  
> 先以共用表開發，Evan 測試後決定是否拆分。

### 狀態管理
```typescript
type LightColor = 'red' | 'yellow' | 'green';
const [marks, setMarks] = useState<Map<string, LightColor>>(new Map());
const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
```
- `marks`：各部位燈色，key = partId
- `selectedPartId`：目前選中的部位
- 完成條件：`marks.size === bodyPartsV2.length`

### 資料結構（`src/data/bodyPartsV2.ts`）
```typescript
export interface BodyPartZone {
  cx: number; // center x as % of displayed image width
  cy: number; // center y as % of displayed image height
  w: number;  // zone width as %
  h: number;  // zone height as %
}

export interface BodyPartV2 {
  id: string;
  name: string;
  zones: BodyPartZone[];
}

export const bodyPartsV2: BodyPartV2[] = [...];
```

### 路由
- 新增 `/body-traffic-light/mark` route，component: `BodyMarkPage`
- 已有路由 `/body-traffic-light/pick-doll`（HO-774）傳入 `?doll=` param

## User Scenarios & Testing

### User Story 1 — 選中部位並標記燈色 (Priority: P1)

兒童看到人偶圖，點擊「私密處」區域後部位高亮，再點「🔴 紅燈」按鈕，私密處顯示紅色圓圈。

**Acceptance Scenarios**:
1. **Given** 進入 `/body-traffic-light/mark?doll=female`, **When** 頁面載入, **Then** 顯示女生人偶圖 + 10 個 hit area 輪廓圓圈 + 底部三色按鈕
2. **Given** 頁面載入完成, **When** 點擊私密處 hit area, **Then** 私密處顯示選中高亮，其餘部位無高亮
3. **Given** 私密處已選中, **When** 點擊「🔴 紅燈」, **Then** 私密處顯示紅色圓圈，部位仍選中狀態
4. **Given** 點擊「🟢 綠燈」時無選中部位, **Then** 所有部位燈色不變

### User Story 2 — 重新修改燈色 (Priority: P1)

已標記綠色的「頭髮」，兒童點擊後改為黃色。

**Acceptance Scenarios**:
1. **Given** 頭髮已標記 🟢, **When** 再次點擊頭髮 hit area, **Then** 頭髮進入選中狀態（仍顯示綠色圓圈）
2. **Given** 頭髮選中中, **When** 點擊「🟡 黃燈」, **Then** 頭髮圓圈改為黃色

### User Story 3 — 完成全部標記後出現「完成設定」(Priority: P1)

兒童把 10 個部位全部標記完成，「完成設定」按鈕從底部滑出。

**Acceptance Scenarios**:
1. **Given** 9/10 部位已標記, **When** 標記最後一個部位, **Then** 「完成設定」按鈕以動畫出現
2. **Given** 10/10 已標記，「完成設定」已出現, **When** 修改其中一個部位的燈色, **Then** 「完成設定」按鈕保持可見
3. **Given** 10/10 已標記, **When** 點擊「完成設定」, **Then** 導向觸碰測試頁

### User Story 4 — 男生人偶座標正確 (Priority: P1)

進入 `?doll=male` 時，所有 hit area 對準男生人偶的對應部位。

**Acceptance Scenarios**:
1. **Given** 進入 `?doll=male`, **When** 頁面載入, **Then** 顯示男生人偶圖（非女生）
2. **Given** 男生人偶頁面, **When** 點擊腹部區域, **Then** 「肚子」hit area 被選中

### User Story 5 — doll param 異常處理 (Priority: P2)

**Acceptance Scenarios**:
1. **Given** 進入 `/body-traffic-light/mark`（無 param）, **When** 頁面載入, **Then** fallback 顯示女生人偶
2. **Given** 進入 `?doll=alien`（無效值）, **When** 頁面載入, **Then** fallback 顯示女生人偶

## Out of Scope

- 觸碰測試頁（下一個 issue，Phase 4）
- 音效/語音（本頁無語音需求，保留 useAudioPlayer hook 介面）
- 各部位說明文字彈窗（v1 有，v2 本頁不需要，說明在燈色選擇後顯示）
- 男/女人偶各別座標表的建立（先共用，Evan 視覺測試後決定）
- 進度條或儲存功能

## File Changes

- `src/data/bodyPartsV2.ts` — new，10 個部位資料 + 座標（Option B 估算值）
- `src/pages/BodyMarkPage.tsx` — new，主頁面元件
- `src/App.tsx` — 新增 route `/body-traffic-light/mark`
- `e2e/body-mark.spec.ts` — new，E2E 測試
