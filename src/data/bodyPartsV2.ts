// cx/cy/w/h are percentages of the 1024 × 1705 clean doll-only PNG.
// The ten logical parts keep paired zones for ears, shoulders, hands, and thighs.
// Coordinates are shared by both clean gender variants; their body layout matches.
export interface BodyPartZone {
  cx: number; // center x %
  cy: number; // center y %
  w: number;  // width %
  h: number;  // height %
}

export interface BodyPartV2 {
  id: string;
  name: string;
  zones: BodyPartZone[];
}

export const bodyPartsV2: BodyPartV2[] = [
  {
    id: "head",
    name: "頭 / 頭髮",
    zones: [{ cx: 50, cy: 17, w: 38, h: 20 }],
  },
  {
    id: "face",
    name: "臉",
    zones: [{ cx: 50, cy: 29, w: 32, h: 14 }],
  },
  {
    id: "ear",
    name: "耳朵",
    zones: [
      { cx: 29, cy: 28, w: 12, h: 11 },
      { cx: 71, cy: 28, w: 12, h: 11 },
    ],
  },
  {
    id: "mouth",
    name: "嘴巴",
    zones: [{ cx: 50, cy: 33, w: 18, h: 7 }],
  },
  {
    id: "shoulder",
    name: "肩膀",
    zones: [
      { cx: 35, cy: 42, w: 20, h: 14 },
      { cx: 65, cy: 42, w: 20, h: 14 },
    ],
  },
  {
    id: "chest",
    name: "胸部",
    zones: [{ cx: 50, cy: 49, w: 32, h: 17 }],
  },
  {
    id: "hand",
    name: "手",
    zones: [
      { cx: 14, cy: 55, w: 18, h: 12 },
      { cx: 86, cy: 55, w: 18, h: 12 },
    ],
  },
  {
    id: "belly",
    name: "肚子",
    zones: [{ cx: 50, cy: 57, w: 32, h: 13 }],
  },
  {
    id: "private",
    name: "私密處",
    zones: [{ cx: 50, cy: 64, w: 28, h: 14 }],
  },
  {
    id: "thigh",
    name: "大腿",
    zones: [
      { cx: 44, cy: 74, w: 16, h: 17 },
      { cx: 56, cy: 74, w: 16, h: 17 },
    ],
  },
];
