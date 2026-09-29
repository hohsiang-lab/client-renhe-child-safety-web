import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { BODY_TRAFFIC_LIGHTS } from "../data/bodyTrafficLights";
import { bodyPartsV2 } from "../data/bodyPartsV2";
import { useBodyTrafficLightStore } from "../stores/useBodyTrafficLightStore";

const HELP_RESOURCES = [
  {
    phone: "113",
    name: "保護專線",
    desc: "24 小時免費，有人會幫助你",
    color: "bg-red-danger-bg",
  },
  {
    phone: "110",
    name: "報案專線",
    desc: "遇到危險可以打這支電話",
    color: "bg-red-danger-bg",
  },
  {
    phone: "1925",
    name: "安心專線",
    desc: "心裡不舒服可以打來聊聊",
    color: "bg-green-safe-bg",
  },
  {
    phone: "iWIN",
    name: "網路內容防護機構",
    desc: "網路上的不安全可以向這裡求助",
    color: "bg-green-safe-bg",
  },
];

export default function EndingPage() {
  const navigate = useNavigate();
  const { play, stop } = useAudioPlayer();
  const marks = useBodyTrafficLightStore((state) => state.marks);
  const markedCount = Object.keys(marks).length;

  useEffect(() => {
    play("/audio/ending.mp3", { caption: "你好棒！今天學到了很多保護自己的方法！" });
    return stop;
  }, [play, stop]);

  function replayBodyMark() {
    stop();
    navigate("/body-traffic-light");
  }

  function returnToMenu() {
    stop();
    navigate("/menu");
  }

  return (
    <div className="relative min-h-dvh">
      <motion.div
        className="relative flex min-h-dvh flex-col items-center px-4 py-8 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <section className="paper-card w-full max-w-xl bg-warm-card p-5 sm:p-7">
          <motion.h1
            className="mb-3 text-4xl font-bold md:text-5xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            你好棒！
          </motion.h1>
          <motion.p
            className="text-text-light mb-8 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            今天學到了很多保護自己的方法！
          </motion.p>

          <section aria-labelledby="body-mark-results-title" className="paper-card mb-5 bg-white p-4 text-left">
            <h2 id="body-mark-results-title" className="mb-2 text-lg font-bold">標記進度</h2>
            <p>已完成標記 {markedCount} / {bodyPartsV2.length} 個部位</p>
          </section>

          <section aria-labelledby="body-mark-review-title" className="paper-card mb-6 bg-warm-bg p-4 text-left">
            <h2 id="body-mark-review-title" className="mb-3 text-lg font-bold">重點回顧</h2>
            <ul className="space-y-2 leading-relaxed">
              {BODY_TRAFFIC_LIGHTS.map((light) => (
                <li key={light.id} className="flex items-start gap-2">
                  <span aria-hidden="true" className="shrink-0">{light.emoji}</span>
                  <p><strong>{light.label}：</strong>{light.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <motion.div
            className="w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 className="mb-4 text-2xl font-bold">需要幫助嗎？</h2>
            <div className="space-y-3">
              {HELP_RESOURCES.map((resource) => (
                <div
                  key={resource.phone}
                  className={`paper-card flex items-center gap-4 ${resource.color} p-4 text-left`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-2xl font-bold">{resource.phone}</span>
                      <span className="font-semibold">{resource.name}</span>
                    </div>
                    <p className="text-text-light mt-0.5 text-sm">{resource.desc}</p>
                  </div>
                </div>
              ))}
              <div className="paper-card bg-warm-bg p-4 text-left">
                <div className="font-semibold">當地社福單位</div>
                <p className="text-text-light mt-0.5 text-sm">（由仁和社區提供聯絡資訊）</p>
              </div>
            </div>
          </motion.div>
        </section>

        <motion.div
          className="mt-6 flex flex-col gap-4 sm:flex-row"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.button
            onClick={replayBodyMark}
            className="paper-button bg-primary hover:bg-primary-hover cursor-pointer px-10 py-4 text-xl font-bold text-text-main"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            再玩一次
          </motion.button>
          <motion.button
            onClick={returnToMenu}
            className="paper-button cursor-pointer bg-warm-card px-10 py-4 text-xl font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            回到主選單
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
