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
    options: ["老師", "自己忍耐", "那個人的朋友"],
    correctIndex: 0,
    explanation: "老師會幫助你、保護你，不要自己忍耐",
  },
  {
    id: 2,
    scenario: "放學路上有陌生人一直跟著你，你該怎麼辦？",
    options: ["跟他走", "趕快跑到附近商店求助", "假裝沒看到"],
    correctIndex: 1,
    explanation: "趕快到有大人的地方求助是最安全的做法",
  },
  {
    id: 3,
    scenario: "有個大人叫你保密，說的話讓你很害怕，你可以怎麼做？",
    options: ["乖乖保密", "告訴爸爸媽媽", "不理他就好"],
    correctIndex: 1,
    explanation: "讓你害怕的秘密一定要告訴爸媽或信任的大人",
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
    options: ["爸媽、老師、警察", "網路上認識的人", "路邊的陌生人"],
    correctIndex: 0,
    explanation: "爸媽、老師和警察都是可以信任的大人",
  },
];
