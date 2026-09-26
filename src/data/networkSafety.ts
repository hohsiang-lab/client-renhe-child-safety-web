export type NetworkSafetyQuestion = {
  id: number;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const networkSafetyQuestions: NetworkSafetyQuestion[] = [
  {
    id: 1,
    scenario: "你在網路上認識的人想看你的私密照片，還要你開視訊。你該怎麼做？",
    options: [
      "先傳一張，看看他會不會保密。",
      "不傳照片、不開視訊，告訴信任的大人。",
      "如果他說是朋友，就答應開視訊。",
    ],
    correctIndex: 1,
    explanation: "你可以拒絕任何讓你不舒服的要求。先停下來，找信任的大人幫忙。",
  },
  {
    id: 2,
    scenario: "遊戲裡有人說要送你點數，要求你先傳照片或個人資料。你該怎麼做？",
    options: [
      "把家人的電話或住址傳給他。",
      "不為了點數或禮物傳照片或個人資料，先告訴大人。",
      "先傳一張照片換點數。",
    ],
    correctIndex: 1,
    explanation: "點數或禮物不是交換照片或個人資料的理由。不要傳自己的或別人的私密影像。",
  },
  {
    id: 3,
    scenario: "有人說要幫你拿遊戲道具，向你要帳號、密碼或簡訊驗證碼。你該怎麼做？",
    options: [
      "把密碼傳給他，之後再改掉。",
      "只給一次驗證碼，請他幫忙。",
      "不提供密碼或驗證碼，立刻告訴信任的大人。",
    ],
    correctIndex: 2,
    explanation: "帳號、密碼和簡訊驗證碼都要保密；需要幫忙時，先問信任的大人。",
  },
  {
    id: 4,
    scenario: "有人威脅要公開你的私密照片，叫你再傳更多照片或付錢。你該怎麼做？",
    options: [
      "不付錢、不再傳照片；保留威脅訊息，找信任的大人。",
      "照他的要求付錢或再傳照片，請他刪掉。",
      "自己去罵他，要求他停止。",
    ],
    correctIndex: 0,
    explanation: "這不是你的錯。不要付錢或再傳照片；保留威脅訊息、對方帳號與網址等線索，找大人一起求助。",
  },
  {
    id: 5,
    scenario: "你收到別人傳來的私密照片，應該怎麼處理？",
    options: [
      "轉給朋友一起看，問他怎麼辦。",
      "不下載、不保存、不轉傳，告訴可信任的大人。",
      "先存起來，等對方要求再處理。",
    ],
    correctIndex: 1,
    explanation: "不要點閱或散布別人的私密影像；告訴信任的大人，讓大人協助向平台通報。",
  },
  {
    id: 6,
    scenario: "如果你或朋友遇到上面的情況，較安全的處理順序是什麼？",
    options: [
      "刪掉所有對話，假裝沒發生。",
      "把私密照片傳給朋友，請大家幫忙。",
      "停止回覆 → 保留對話、帳號、網址等線索 → 封鎖／檢舉 → 告訴信任的大人。",
    ],
    correctIndex: 2,
    explanation: "保留的是對話、帳號、網址或時間等線索，不是把私密影像另存或轉傳。請信任的大人陪你使用求助管道。",
  },
];
