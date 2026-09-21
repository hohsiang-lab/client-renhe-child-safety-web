// cx/cy/w/h are percentages of the displayed 2268 × 6047 customer PNG.
// The ten logical parts keep paired zones where the supplied arrows are paired.
// Coordinates are shared by both supplied gender variants; their body layout matches.
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
    zones: [{ cx: 50, cy: 31, w: 28, h: 12 }],
  },
  {
    id: "face",
    name: "臉",
    zones: [{ cx: 50, cy: 41, w: 30, h: 14 }],
  },
  {
    id: "ear",
    name: "耳朵",
    zones: [
      { cx: 17, cy: 43, w: 12, h: 10 },
      { cx: 83, cy: 43, w: 12, h: 10 },
    ],
  },
  {
    id: "mouth",
    name: "嘴巴",
    zones: [{ cx: 50, cy: 47, w: 20, h: 8 }],
  },
  {
    id: "shoulder",
    name: "肩膀",
    zones: [
      { cx: 29, cy: 54, w: 18, h: 12 },
      { cx: 71, cy: 54, w: 18, h: 12 },
    ],
  },
  {
    id: "chest",
    name: "胸部",
    zones: [{ cx: 50, cy: 60, w: 30, h: 14 }],
  },
  {
    id: "hand",
    name: "手",
    zones: [
      { cx: 13, cy: 64, w: 18, h: 12 },
      { cx: 87, cy: 64, w: 18, h: 12 },
    ],
  },
  {
    id: "belly",
    name: "肚子",
    zones: [{ cx: 50, cy: 70, w: 30, h: 12 }],
  },
  {
    id: "private",
    name: "私密處",
    zones: [{ cx: 50, cy: 77, w: 26, h: 11 }],
  },
  {
    id: "thigh",
    name: "大腿",
    zones: [
      { cx: 39, cy: 84, w: 15, h: 14 },
      { cx: 61, cy: 84, w: 15, h: 14 },
    ],
  },
];
