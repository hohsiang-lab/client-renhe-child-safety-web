export interface SecretQuestion {
  id: number;
  scenario: string;
  answer: "good" | "bad";
  explanation: string;
}

export const secretQuestions: SecretQuestion[] = [
  {
    id: 1,
    scenario:
      "媽媽生日快到了，爸爸帶你去買蛋糕，說要給媽媽一個驚喜，先不要告訴媽媽喔！",
    answer: "good",
    explanation: "這是讓人開心的驚喜，時間到了就會知道",
  },
  {
    id: 2,
    scenario: "聖誕節你和同學一起準備卡片要送給老師，大家說先保密！",
    answer: "good",
    explanation: "這個秘密是為了給別人快樂，不會讓人不舒服",
  },
  {
    id: 3,
    scenario: "你做了一個手工禮物要在母親節給媽媽，你偷偷藏在書包裡",
    answer: "good",
    explanation: "這是充滿愛的秘密，會讓媽媽很感動",
  },
  {
    id: 4,
    scenario:
      "有個大人摸了你的身體，叫你不可以告訴任何人，不然會被罵",
    answer: "bad",
    explanation: "讓你害怕的秘密就是壞秘密，一定要告訴信任的大人",
  },
  {
    id: 5,
    scenario: "有人給你糖果，說這是你們之間的秘密，不能跟爸媽說",
    answer: "bad",
    explanation: "要你對爸媽保密的事情，通常不是好事，要趕快告訴大人",
  },
  {
    id: 6,
    scenario:
      "有個人對你做了讓你不舒服的事，他說如果你說出去，就不跟你玩了",
    answer: "bad",
    explanation: "用威脅叫你保密的都是壞秘密，勇敢告訴信任的大人",
  },
];
