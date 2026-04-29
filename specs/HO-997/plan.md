# HO-997 Plan — 秘密遊戲圖片卡片 + 翻面動畫

## 技術設計

### 架構概覽

```
src/
├── data/
│   └── secrets.ts          ← 更新 SecretQuestion interface + 7 題資料
├── components/
│   └── SecretCard.tsx       ← 新增：單張可翻面卡片組件
└── pages/
    └── SecretGamePage.tsx   ← 修改：grid 改用 SecretCard + 移除 detail phase
```

### 1. 資料層：`src/data/secrets.ts`

更新 `SecretQuestion` interface：

```typescript
export interface SecretQuestion {
  id: number;
  scenario: string;        // alt text (無障礙)
  answer: "good" | "bad";
  explanation: string;     // alt text for back image
  frontImage: string;      // e.g. "/images/secrets/q1-front.png"
  backImage: string;       // e.g. "/images/secrets/q1-back.png"
}
```

`secretQuestions` 更新為 7 題新情境（id 1–7）。

### 2. 新組件：`src/components/SecretCard.tsx`

純 CSS 3D flip 實作（不依賴 framer-motion 3D）：

**Props：**
```typescript
interface SecretCardProps {
  question: SecretQuestion;
  viewed: boolean;
  onFlipped: (id: number) => void;
  onTrustedAdults: () => void;
}
```

**CSS 3D flip 結構：**
```
<div style={{ perspective: "1000px" }}>
  <div
    className="card-inner"          // transform-style: preserve-3d
    style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
  >
    <div className="card-front">    // backface-visibility: hidden
      <img src={frontImage} alt={scenario} />
      {viewed && <span className="viewed-badge">✅</span>}
    </div>
    <div className="card-back">     // backface-visibility: hidden; transform: rotateY(180deg)
      <img src={backImage} alt={explanation} />
      {answer === "bad" && <TrustedAdultsButton />}
    </div>
  </div>
</div>
```

**狀態：** `flipped: boolean`（local state，點擊 toggle）

**onFlipped callback：** 翻到正面→背面時觸發（回報 parent 更新 `viewedIds`）

### 3. 頁面：`src/pages/SecretGamePage.tsx`

**Phase 移除：** `"detail"` phase 不再需要，phase 定義改為：
```typescript
type Phase = "intro" | "grid" | "trusted-adults";
```

**Grid phase 改動：**
- 現有 `<motion.button>` 文字卡片 → 改用 `<SecretCard>`
- `openDetail` / `closeDetail` 函數移除
- `openTrustedAdults` 從 `SecretCard` 的 callback 觸發
- `viewedIds` 更新邏輯：SecretCard 翻至背面時觸發

**移除的邏輯：**
- `selected` state（不再需要選中卡片）
- `openDetail` / `closeDetail` handlers
- AudioPlayer 在 grid 的使用（若 pending 的背面音效需求確認後再加）

### 4. CSS 處理方案

使用 inline style 處理 3D flip（避免 Tailwind purge 問題）：

```typescript
const cardInnerStyle = {
  transformStyle: "preserve-3d" as const,
  transition: "transform 350ms ease-in-out",
  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
};

const cardFaceStyle = {
  backfaceVisibility: "hidden" as const,
  WebkitBackfaceVisibility: "hidden" as const,
};

const cardBackStyle = {
  ...cardFaceStyle,
  transform: "rotateY(180deg)",
};
```

或在 `globals.css` / `index.css` 加入 `.card-inner`, `.card-front`, `.card-back` utility class。

## 圖片資產假設

- 路徑：`public/images/secrets/q{id}-front.png`, `q{id}-back.png`
- 14 張圖片（7 正面 + 7 背面）
- 客戶尚未提供，**實作前需確認命名規範**

## 風險與假設

| 風險 | 緩解 |
|---|---|
| 圖片未到位 | 使用 placeholder 顏色區塊 + alt text 先行開發 |
| iOS Safari backface-visibility | 加 `-webkit-` prefix；inline style 確保生效 |
| 背面音效需求待確認 | audio 邏輯預留 hook，pending 確認後接入 |

## 依賴

- 現有：`framer-motion`（page-level 動畫保留）
- 無新依賴
