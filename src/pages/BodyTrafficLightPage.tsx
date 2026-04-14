import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { bodyParts, type BodyPart } from "../data/bodyParts";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import BodySvg from "../components/BodySvg";

type Phase = "exploring" | "complete";

export default function BodyTrafficLightPage() {
  const navigate = useNavigate();
  const { play, stop } = useAudioPlayer();

  const [activePart, setActivePart] = useState<string | null>(null);
  const [exploredParts, setExploredParts] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<Phase>("exploring");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeData: BodyPart | undefined = bodyParts.find(
    (p) => p.id === activePart,
  );

  const handlePartClick = useCallback(
    (partId: string) => {
      if (phase !== "exploring") return;

      setActivePart(partId);
      play(`/audio/body-${partId}.mp3`);

      setExploredParts((prev) => {
        const next = new Set(prev);
        next.add(partId);
        return next;
      });
    },
    [phase, play],
  );

  useEffect(() => {
    if (phase === "exploring" && exploredParts.size === bodyParts.length) {
      timerRef.current = setTimeout(() => setPhase("complete"), 1500);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [exploredParts.size, phase]);

  useEffect(() => {
    if (phase === "complete") {
      play("/audio/body-complete.mp3");
    }
  }, [phase, play]);

  useEffect(() => {
    return () => {
      stop();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stop]);

  if (phase === "complete") {
    return (
      <motion.div
        className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mb-6 text-7xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          🎉
        </motion.div>
        <h1 className="mb-3 text-3xl font-bold">太棒了！</h1>
        <p className="text-text-light mb-2 text-lg">
          你已經認識了身體的{" "}
          <span className="text-primary font-bold">{exploredParts.size}</span> /{" "}
          {bodyParts.length} 個部位
        </p>
        <p className="text-text-light mb-10 text-base">
          記住：紅燈的地方是私密部位，別人不可以隨便碰喔！
        </p>
        <motion.button
          onClick={() => navigate("/menu")}
          className="bg-primary hover:bg-primary-hover cursor-pointer rounded-full px-10 py-4 text-lg font-bold text-white shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          回到選單
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center px-6 py-8">
      <motion.div
        className="mb-4 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="mb-1 text-2xl font-bold">身體紅綠燈 🚦</h1>
        <p className="text-text-light text-sm">點擊身體部位，看看是紅燈還是綠燈</p>
      </motion.div>

      {/* Progress dots */}
      <div className="mb-6 flex gap-2">
        {bodyParts.map((part) => (
          <motion.div
            key={part.id}
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: exploredParts.has(part.id)
                ? part.signal === "red"
                  ? "#ff8a80"
                  : "#a8e6cf"
                : "#e0d6c8",
            }}
            animate={
              exploredParts.has(part.id) ? { scale: [1, 1.3, 1] } : undefined
            }
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      <p className="text-text-light mb-4 text-xs">
        已探索 {exploredParts.size} / {bodyParts.length}
      </p>

      <div className="flex w-full max-w-[800px] flex-col items-center gap-6 md:flex-row md:items-start">
        {/* SVG body */}
        <div className="w-full max-w-[280px] md:w-1/2">
          <BodySvg
            activePart={activePart}
            exploredParts={exploredParts}
            onPartClick={handlePartClick}
          />
        </div>

        {/* Info panel */}
        <div className="w-full md:w-1/2">
          <AnimatePresence mode="wait">
            {activeData ? (
              <motion.div
                key={activeData.id}
                className={`rounded-2xl p-6 shadow-md ${
                  activeData.signal === "red"
                    ? "bg-red-danger-bg"
                    : "bg-green-safe-bg"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-3 text-center text-4xl">
                  {activeData.signal === "red" ? "🔴" : "🟢"}
                </div>
                <h2 className="mb-2 text-center text-xl font-bold">
                  {activeData.name}
                </h2>
                <p
                  className={`text-center text-base leading-relaxed ${
                    activeData.signal === "red"
                      ? "text-red-danger"
                      : "text-green-safe"
                  }`}
                >
                  {activeData.description}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="bg-warm-card rounded-2xl p-6 shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="mb-3 text-center text-4xl">👆</div>
                <p className="text-text-light text-center text-base">
                  點擊身體的任何一個部位，看看它是什麼顏色的燈！
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
