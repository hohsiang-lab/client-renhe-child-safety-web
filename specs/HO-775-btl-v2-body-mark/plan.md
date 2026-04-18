# Implementation Plan: 身體紅綠燈 v2 — 身體標記互動

**Feature Branch**: `HO-775-btl-v2-body-mark`
**Based on Spec**: `specs/HO-775-btl-v2-body-mark/spec.md`
**Date**: 2026-04-17

## Architecture Overview

```
BodyMarkPage (new)
├── reads ?doll=female|male from URL
├── state: marks: Map<partId, LightColor>, selectedPartId: string | null
├── DollOverlay (inline component or sub-component)
│   ├── <img> PNG figure
│   └── {bodyPartsV2.flatMap(part => part.zones).map(zone => <HitAreaButton>)}
└── ColorPicker (fixed bottom bar)
    ├── <GreenButton>, <YellowButton>, <RedButton>
    └── <CompleteButton> (conditional, Framer Motion AnimatePresence)
```

## Data Layer

### `src/data/bodyPartsV2.ts` (new)
- Export `BodyPartZone`, `BodyPartV2` types
- Export `bodyPartsV2: BodyPartV2[]` array of 10 parts
- All hit-area coordinates as percentages (sima-estimated, flagged in comments)

## Component Structure

### `BodyMarkPage` (`src/pages/BodyMarkPage.tsx`)

```typescript
// State
const [marks, setMarks] = useState<Map<string, LightColor>>(new Map());
const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
const isComplete = marks.size === bodyPartsV2.length;

// Handlers
handlePartClick(partId: string)   // select part
handleColorPick(color: LightColor) // assign color to selectedPartId
```

**Layout** (mobile-first, single scroll):
```
[padding-top: 16px]
[title: "幫身體各部位選燈色 🚦"]
[subtitle: "點部位 → 選燈色，全選完後才能繼續"]
[DollOverlay: position:relative, max-w-[360px], mx-auto]
  [img: w-full, display:block]
  {hit area buttons × zones}
[fixed bottom-0: ColorPicker bar]
  [AnimatePresence: CompleteButton 向上滑入]
  [three color buttons]
```

### Hit Area Button Design

```tsx
<button
  style={{
    position: 'absolute',
    left: `${zone.cx}%`,
    top: `${zone.cy}%`,
    width: `${zone.w}%`,
    transform: 'translate(-50%, -50%)',
    aspectRatio: '1',
    minWidth: '48px',
    minHeight: '48px',
  }}
  className="rounded-full ..."
  onClick={() => handlePartClick(part.id)}
  aria-label={part.name}
/>
```

Visual states per zone:
- **未標記 + 未選中**：透明 + dashed border (warm-muted)
- **未標記 + 選中**：半透明白色 bg + solid border (blue-500)
- **已標記 + 未選中**：對應燈色 50% opacity bg
- **已標記 + 選中**：對應燈色 70% opacity bg + solid ring

### Color Picker Bar

Fixed bottom bar with padding-bottom for safe area:
```
[完成設定 button — AnimatePresence, slides up from below]
[🟢] [🟡] [🔴]
```
- Buttons: large tap targets (min 56px height)
- Active state: scale 1.15 + shadow when `selectedPartId` has that color

## Routing

### `src/App.tsx` — add:
```tsx
<Route path="/body-traffic-light/mark" element={<BodyMarkPage />} />
```
Position: after `/body-traffic-light/pick-doll` route.

## E2E Test Strategy

### `e2e/body-mark.spec.ts` (new)

Key test cases:
1. Page load with `?doll=female` → img src contains `doll-female.png`, 10 hit areas visible
2. Page load with `?doll=male` → img src contains `doll-male.png`
3. Click `[aria-label="私密處"]` → assert selected state CSS class
4. Click color button 🔴 → assert `data-color="red"` on private hit area
5. Re-click same part → remains selected, color unchanged until new color picked
6. Mark all 10 parts → "完成設定" button appears
7. Click "完成設定" → navigation occurs (assert URL change)
8. Invalid doll param → fallback to female image

## Implementation Sequence

1. `src/data/bodyPartsV2.ts` — data file (no deps)
2. `src/pages/BodyMarkPage.tsx` — main page (depends on data)
3. `src/App.tsx` — add route (depends on BodyMarkPage)
4. `e2e/body-mark.spec.ts` — E2E tests (depends on all above)

## Risk Notes

- **Coordinate accuracy**: sima-estimated coordinates are approximate; Evan must visually test on device and adjust `bodyPartsV2.ts`. If male doll diverges >3% from female, split into `bodyPartsV2Female` / `bodyPartsV2Male`.
- **Min touch target**: `minWidth: 48px` is enforced in CSS; on very small screens some zones may overlap — acceptable for MVP.
- **"完成設定" route**: next page (Phase 4 touch test) is TBD; placeholder navigate to `/body-traffic-light` until HO-776 spec.
