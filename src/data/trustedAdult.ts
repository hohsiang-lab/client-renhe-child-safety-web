export interface TrustQuestion {
  id: number;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

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
    scenario: "下面哪些人是你可以信任、可以說秘密的大人？",
    options: ["一位你覺得安全、願意聽你說的大人（例如家人、老師或警察）", "自己忍耐，不告訴任何人", "告訴一位讓你害怕或要求你保密的大人"],
    correctIndex: 0,
    explanation: "家人、老師、警察或其他大人都可能幫忙；沒有哪種身分一定安全。選擇讓你覺得安全、願意聽你說的大人。",
  },
];
