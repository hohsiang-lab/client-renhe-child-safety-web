// cx/cy/w/h are percentages of the displayed PNG container dimensions
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
    zones: [{ cx: 50, cy: 22, w: 22, h: 10 }], // sima-estimated
  },
  {
    id: "face",
    name: "臉",
    zones: [{ cx: 50, cy: 26, w: 15, h: 9 }], // sima-estimated
  },
  {
    id: "ear",
    name: "耳朵",
    zones: [{ cx: 37, cy: 25, w: 9, h: 7 }], // sima-estimated (doll's right ear)
  },
  {
    id: "mouth",
    name: "嘴巴",
    zones: [{ cx: 50, cy: 29, w: 11, h: 5 }], // sima-estimated
  },
  {
    id: "shoulder",
    name: "肩膀",
    zones: [
      { cx: 28, cy: 35, w: 12, h: 8 }, // sima-estimated (left)
      { cx: 72, cy: 35, w: 12, h: 8 }, // sima-estimated (right)
    ],
  },
  {
    id: "chest",
    name: "胸部",
    zones: [{ cx: 50, cy: 40, w: 22, h: 9 }], // sima-estimated
  },
  {
    id: "hand",
    name: "手",
    zones: [
      { cx: 19, cy: 46, w: 12, h: 13 }, // sima-estimated (left)
      { cx: 81, cy: 46, w: 12, h: 13 }, // sima-estimated (right)
    ],
  },
  {
    id: "belly",
    name: "肚子",
    zones: [{ cx: 50, cy: 51, w: 22, h: 8 }], // sima-estimated
  },
  {
    id: "private",
    name: "私密處",
    zones: [{ cx: 50, cy: 58, w: 20, h: 8 }], // sima-estimated
  },
  {
    id: "thigh",
    name: "大腿",
    zones: [
      { cx: 40, cy: 64, w: 13, h: 10 }, // sima-estimated (left)
      { cx: 60, cy: 64, w: 13, h: 10 }, // sima-estimated (right)
    ],
  },
];
