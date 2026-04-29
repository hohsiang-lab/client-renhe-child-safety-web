export interface SecretQuestion {
  id: number;
  scenario: string;
  answer: "good" | "bad";
  explanation: string;
  frontImage: string;
  backImage: string;
}

export const secretQuestions: SecretQuestion[] = [
  {
    id: 1,
    scenario: "媽媽生日快到了，我們偷偷做卡片給她",
    answer: "good",
    explanation: "是開心的秘密，對別人不會有傷害",
    frontImage: "/images/secrets/q1-front.png",
    backImage: "/images/secrets/q1-back.png",
  },
  {
    id: 2,
    scenario: "有人說摸他一下給我禮物，但不能說這個秘密",
    answer: "bad",
    explanation: "這是危險行為，請馬上告訴信任的大人",
    frontImage: "/images/secrets/q2-front.png",
    backImage: "/images/secrets/q2-back.png",
  },
  {
    id: 3,
    scenario: "有人傳奇怪的照片給我，說這是我們的秘密",
    answer: "bad",
    explanation: "當有人讓你不舒服，請立即告訴信任的大人",
    frontImage: "/images/secrets/q3-front.png",
    backImage: "/images/secrets/q3-back.png",
  },
  {
    id: 4,
    scenario: "一起偷偷準備禮物給朋友，因為要給他驚喜",
    answer: "good",
    explanation: "正常的友誼互動，沒壓力也不會感到害怕",
    frontImage: "/images/secrets/q4-front.png",
    backImage: "/images/secrets/q4-back.png",
  },
  {
    id: 5,
    scenario: "有人找我玩醫生遊戲，說不能跟爸爸媽媽說",
    answer: "bad",
    explanation: "有壓力的秘密 + 害怕，要立刻告訴信任的大人",
    frontImage: "/images/secrets/q5-front.png",
    backImage: "/images/secrets/q5-back.png",
  },
  {
    id: 6,
    scenario: "朋友跟我說一起準備，給另一個朋友生日驚喜",
    answer: "good",
    explanation: "這是快樂、短暫的秘密，沒有讓你不舒服或害怕",
    frontImage: "/images/secrets/q6-front.png",
    backImage: "/images/secrets/q6-back.png",
  },
  {
    id: 7,
    scenario: "網友說這是我們的秘密，不能讓你爸媽知道",
    answer: "bad",
    explanation: "不隨便透漏個資給網路認識的朋友",
    frontImage: "/images/secrets/q7-front.png",
    backImage: "/images/secrets/q7-back.png",
  },
];
