import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import BodySvg from "../components/BodySvg";

const LIGHTS = [
  {
    id: "green",
    emoji: "🟢",
    text: "普通朋友可以碰觸的地方",
    audio: "/audio/btl-green.mp3",
  },
  {
    id: "yellow",
    emoji: "🟡",
    text: "要先問我才能碰的地方",
    audio: "/audio/btl-yellow.mp3",
  },
  {
    id: "red",
    emoji: "🔴",
    text: "任何人都不能隨意看或碰的私密部位",
    audio: "/audio/btl-red.mp3",
  },
] as const;

const popIn = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: "spring" as const, duration: 0.5 },
};

export default function BodyTrafficLightPage() {
  const navigate = useNavigate();
  const { play, stop } = useAudioPlayer();
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    function playNext(index: number) {
      if (cancelled || index >= LIGHTS.length) return;
      setVisibleCount(index + 1);
      play(LIGHTS[index].audio, {
        onEnd: () => {
          if (!cancelled) playNext(index + 1);
        },
      });
    }

    playNext(0);

    return () => {
      cancelled = true;
      stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-10">
      <motion.h1
        className="mb-8 text-2xl font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        身體紅綠燈
      </motion.h1>

      <div className="flex w-full max-w-sm flex-col gap-5">
        {LIGHTS.map((light, i) => (
          <AnimatePresence key={light.id}>
            {visibleCount > i && (
              <motion.div
                key={light.id}
                className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-md"
                {...popIn}
              >
                <span className="text-5xl">{light.emoji}</span>
                <p className="text-base font-medium leading-snug">
                  {light.text}
                  {light.id === "red" && <small className="mt-1 block text-sm font-normal">照顧、清潔或醫療需要時，也要先說明並尊重你的感受。</small>}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
      <div className="mt-8 w-full max-w-xs rounded-2xl bg-white p-3 shadow-sm">
        <BodySvg activePart={null} exploredParts={new Set()} onPartClick={() => undefined} />
      </div>

      <AnimatePresence>
        {visibleCount === LIGHTS.length && (
          <motion.button
            className="mt-10 cursor-pointer rounded-full bg-green-500 px-10 py-4 text-lg font-bold text-white shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/body-traffic-light/pick-doll")}
          >
            我知道了！
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
