export const BODY_TRAFFIC_LIGHTS = [
  {
    id: "green",
    label: "綠燈",
    emoji: "🟢",
    text: "普通朋友可以碰觸的地方",
    audio: "/audio/btl-green.mp3",
  },
  {
    id: "yellow",
    label: "黃燈",
    emoji: "🟡",
    text: "要先問我才能碰的地方",
    audio: "/audio/btl-yellow.mp3",
  },
  {
    id: "red",
    label: "紅燈",
    emoji: "🔴",
    text: "任何人都不能隨意碰的地方（除了家長和醫生）",
    audio: "/audio/btl-red.mp3",
  },
] as const;
