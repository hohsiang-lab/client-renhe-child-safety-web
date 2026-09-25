export type TrustQuestion =
  | {
      id: number;
      scenario: string;
      options: string[];
      correctIndex: number;
      explanation: string;
      roleSelection?: false;
    }
  | {
      id: number;
      scenario: string;
      explanation: string;
      roleSelection: true;
    };

export const trustedAdultCards = [
  { name: "媽媽", src: "/images/trusted-adults/mom.png" },
  { name: "爸爸", src: "/images/trusted-adults/dad.png" },
  { name: "奶奶", src: "/images/trusted-adults/grandma.png" },
  { name: "老師", src: "/images/trusted-adults/teacher.png" },
  { name: "警察", src: "/images/trusted-adults/police.png" },
  { name: "親戚", src: "/images/trusted-adults/relatives.png" },
  { name: "隔壁叔叔阿姨", src: "/images/trusted-adults/neighbors.png" },
  { name: "媽媽的男朋友", src: "/images/trusted-adults/moms-boyfriend.png" },
] as const;

export const trustQuestions: TrustQuestion[] = [
  {
    id: 1,
    scenario: "有人在學校對你做了不舒服的事，你應該告訴誰？",
    options: ["告訴一位你覺得安全、願意聽你說的大人", "自己忍耐", "那個人的朋友"],
    correctIndex: 0,
    explanation: "如果第一位大人沒有相信你或沒有幫助你，可以繼續告訴下一位你覺得安全、願意聽你說的大人。",
  },
  {
    id: 2,
    scenario: "放學路上有陌生人一直跟著你，你該怎麼辦？",
    options: ["跟他走", "趕快到附近商店，向店員或你覺得安全的人求助", "假裝沒看到"],
    correctIndex: 1,
    explanation: "先到附近有人的商店等公共場所，向店員或你覺得可以求助的大人求助，不要跟陌生人走。",
  },
  {
    id: 3,
    scenario: "有個大人叫你保密，說的話讓你很害怕，你可以怎麼做？",
    options: ["乖乖保密", "告訴一位你覺得安全、願意聽你說的大人", "不理他就好"],
    correctIndex: 1,
    explanation: "讓你害怕的秘密可以告訴一位你覺得安全、願意聽你說的大人；如果第一位沒有幫助，繼續告訴下一位。",
  },
  {
    id: 4,
    scenario: "如果你遇到危險，可以打什麼電話求助？",
    options: ["113", "隨便一個號碼", "不知道"],
    correctIndex: 0,
    explanation: "113 是保護專線，24 小時都有人接聽，記住這個號碼",
  },
  {
    id: 5,
    scenario: "遇到問題時，可以從下面選一位你覺得安全、願意聽你說的大人求助：",
    roleSelection: true,
    explanation: "這些身分只是可能的求助對象，沒有哪種身分一定安全。若第一位沒有幫忙，可以再告訴下一位你覺得安全、願意聽你說的大人。",
  },
];
