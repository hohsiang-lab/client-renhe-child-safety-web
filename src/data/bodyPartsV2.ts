// cx/cy/w/h are percentages of the displayed PNG container dimensions.
// hit zones render as rounded rectangles (industry standard bounding-box approach).
// NOTE: All coordinates estimated by sima; pending Evan's visual verification (HO-775).
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
    zones: [{ cx: 50, cy: 22, w: 22, h: 10 }],
  },
  {
    id: "face",
    name: "臉",
    zones: [{ cx: 50, cy: 26, w: 15, h: 9 }],
  },
  {
    id: "ear",
    name: "耳朵",
    zones: [{ cx: 37, cy: 25, w: 9, h: 7 }],
  },
  {
    id: "mouth",
    name: "嘴巴",
    zones: [{ cx: 50, cy: 29, w: 11, h: 5 }],
  },
  {
    id: "shoulder",
    name: "肩膀",
    zones: [
      { cx: 28, cy: 35, w: 12, h: 8 },
      { cx: 72, cy: 35, w: 12, h: 8 },
    ],
  },
  {
    id: "chest",
    name: "胸部",
    zones: [{ cx: 50, cy: 40, w: 22, h: 9 }],
  },
  {
    id: "hand",
    name: "手",
    zones: [
      { cx: 19, cy: 46, w: 12, h: 13 },
      { cx: 81, cy: 46, w: 12, h: 13 },
    ],
  },
  {
    id: "belly",
    name: "肚子",
    zones: [{ cx: 50, cy: 51, w: 22, h: 8 }],
  },
  {
    id: "private",
    name: "私密處",
    zones: [{ cx: 50, cy: 58, w: 20, h: 8 }],
  },
  {
    id: "thigh",
    name: "大腿",
    zones: [
      { cx: 40, cy: 64, w: 13, h: 10 },
      { cx: 60, cy: 64, w: 13, h: 10 },
    ],
  },
];
