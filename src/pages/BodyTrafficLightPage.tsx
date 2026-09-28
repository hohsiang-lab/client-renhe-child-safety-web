import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { BODY_TRAFFIC_LIGHTS as LIGHTS } from "../data/bodyTrafficLights";

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
        caption: LIGHTS[index].text,
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
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-8 sm:px-6 md:py-10">
      <motion.h1
        className="paper-card mb-6 bg-white/80 px-6 py-3 text-center text-2xl font-bold sm:mb-8 sm:px-8 sm:py-4 sm:text-3xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        身體紅綠燈{" "}
        <span className="traffic-signal-icon" aria-hidden="true">🚦</span>
      </motion.h1>

      <div className="flex w-full max-w-lg flex-col gap-4 sm:gap-5">
        {LIGHTS.map((light, i) => (
          <AnimatePresence key={light.id}>
            {visibleCount > i && (
              <motion.div
                key={light.id}
                className="paper-card flex items-center gap-4 bg-white/80 px-5 py-4"
                {...popIn}
              >
                <span
                  role="img"
                  aria-label={light.label}
                  className={`traffic-light-indicator traffic-light-indicator--${light.id}`}
                >
                  {light.emoji}
                </span>
                <p className="text-base font-medium leading-snug">{light.text}</p>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      <AnimatePresence>
        {visibleCount === LIGHTS.length && (
          <motion.button
            className="paper-card mt-8 cursor-pointer bg-green-500 px-10 py-4 text-lg font-bold text-text-main focus-visible:ring-4 focus-visible:ring-primary focus-visible:outline-none sm:mt-10"
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
