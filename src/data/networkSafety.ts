export interface NetworkQuestion {
  id: number;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const networkQuestions: NetworkQuestion[] = [
  {
    id: 1,
    scenario: "網友要求你傳一張私密照片或開視訊，你會怎麼做？",
    options: ["不傳，停止回應並告訴信任的大人", "照做，這是我們的秘密", "先傳給朋友看看"],
    correctIndex: 0,
    explanation: "不傳私密影像，也不要單獨視訊。保留對話、封鎖對方並求助。",
  },
  {
    id: 2,
    scenario: "有人說送你遊戲點數，就要你給帳號、密碼或驗證碼。",
    options: ["不提供，告訴信任的大人", "把驗證碼給他", "用別人的帳號交換"],
    correctIndex: 0,
    explanation: "帳號、密碼和驗證碼都是自己的秘密，不能交給別人。",
  },
  {
    id: 3,
    scenario: "有人威脅要公開你的私密照片，你可以怎麼做？",
    options: ["停止回應、保留證據、封鎖並求助", "再傳一張求他不要說", "刪掉所有證據自己處理"],
    correctIndex: 0,
    explanation: "這不是你的錯。先保留證據，再封鎖對方並找可信任的大人。",
  },
  {
    id: 4,
    scenario: "你收到別人的私密照片，最安全的做法是？",
    options: ["不轉傳，刪除並告訴大人", "轉傳給同學", "放到群組提醒大家"],
    correctIndex: 0,
    explanation: "私密照片不能轉傳或保存，遇到這種事要立即求助。",
  },
];
