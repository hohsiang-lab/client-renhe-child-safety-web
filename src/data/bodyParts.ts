export interface BodyPart {
  id: string;
  name: string;
  signal: "green" | "red";
  description: string;
}

export const bodyParts: BodyPart[] = [
  {
    id: "head",
    name: "頭 / 頭髮",
    signal: "green",
    description: "別人可以摸你的頭，但如果你不喜歡也可以說不要",
  },
  {
    id: "chest",
    name: "胸部",
    signal: "red",
    description: "這裡是私密的地方，除了洗澡和看醫生，別人不可以碰",
  },
  {
    id: "hand",
    name: "手",
    signal: "green",
    description: "和別人握手、牽手是可以的，但你不想的時候可以拒絕",
  },
  {
    id: "private",
    name: "私密處",
    signal: "red",
    description: "這是身體最私密的地方，絕對不能讓別人碰",
  },
  {
    id: "leg",
    name: "腿",
    signal: "green",
    description: "這裡通常是安全的，但如果讓你不舒服就要說出來",
  },
  {
    id: "foot",
    name: "腳",
    signal: "green",
    description: "腳是可以被碰到的，但你永遠有權利說不",
  },
];
