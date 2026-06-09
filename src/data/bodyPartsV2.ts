// cx/cy/w/h are percentages of the displayed image container dimensions.
// hit zones render as rounded rectangles (industry standard bounding-box approach).
// Coordinates calibrated for doll-female.svg (viewBox 0 0 100 130).
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
    zones: [{ cx: 50, cy: 9.5, w: 24, h: 9 }],
  },
  {
    id: "face",
    name: "臉",
    zones: [{ cx: 50, cy: 15, w: 17, h: 10 }],
  },
  {
    id: "ear",
    name: "耳朵",
    zones: [
      { cx: 39.5, cy: 20, w: 6, h: 7 },
      { cx: 60.5, cy: 20, w: 6, h: 7 },
    ],
  },
  {
    id: "mouth",
    name: "嘴巴",
    zones: [{ cx: 50, cy: 19, w: 12, h: 5 }],
  },
  {
    id: "shoulder",
    name: "肩膀",
    zones: [
      { cx: 29, cy: 27, w: 13, h: 8 },
      { cx: 71, cy: 27, w: 13, h: 8 },
    ],
  },
  {
    id: "chest",
    name: "胸部",
    zones: [{ cx: 50, cy: 35, w: 24, h: 9 }],
  },
  {
    id: "hand",
    name: "手",
    zones: [
      { cx: 15, cy: 50, w: 13, h: 9 },
      { cx: 85, cy: 50, w: 13, h: 9 },
    ],
  },
  {
    id: "belly",
    name: "肚子",
    zones: [{ cx: 50, cy: 43, w: 24, h: 8 }],
  },
  {
    id: "private",
    name: "私密處",
    zones: [{ cx: 50, cy: 53, w: 22, h: 7 }],
  },
  {
    id: "thigh",
    name: "大腿",
    zones: [
      { cx: 40, cy: 76, w: 14, h: 12 },
      { cx: 60, cy: 76, w: 14, h: 12 },
    ],
  },
];
