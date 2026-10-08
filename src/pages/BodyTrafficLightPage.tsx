import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useAudioContext } from "../hooks/useAudioContext";
import { AudioCaption } from "../components/AudioCaption";
import { BODY_TRAFFIC_LIGHTS as LIGHTS } from "../data/bodyTrafficLights";
import { useBodyTrafficLightStore } from "../stores/useBodyTrafficLightStore";

const popIn = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: "spring" as const, duration: 0.5 },
};

export default function BodyTrafficLightPage() {
  const navigate = useNavigate();
  const { play, stop, isPlaying, currentSrc } = useAudioPlayer();
  const { currentCaption, isMuted, replayCurrentAudio } = useAudioContext();
  const reset = useBodyTrafficLightStore((state) => state.reset);
  const [visibleCount, setVisibleCount] = useState(0);
  const activeLight = LIGHTS[visibleCount - 1];
  const matchingLight = activeLight?.text === currentCaption ? activeLight : undefined;
  const currentlyPlayingLight =
    matchingLight && isPlaying && currentSrc === matchingLight.audio ? matchingLight : undefined;

  useEffect(() => {
    reset();
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
  }, [play, reset, stop]);

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

      <div
        className="bg-warm-bg mb-4 h-2 w-full max-w-lg overflow-hidden rounded-full"
        role="progressbar"
        aria-label="身體紅綠燈重點介紹進度"
        aria-valuemin={0}
        aria-valuemax={LIGHTS.length}
        aria-valuenow={visibleCount}
        aria-valuetext={`${visibleCount} / ${LIGHTS.length} 個重點`}
      >
        <div
          className="bg-primary h-full rounded-full transition-[width]"
          style={{ width: `${(visibleCount / LIGHTS.length) * 100}%` }}
        />
      </div>

      <div className="flex w-full max-w-lg flex-col gap-4 sm:gap-5">
        {LIGHTS.map((light, i) => (
          <AnimatePresence key={light.id}>
            {visibleCount > i && (
              <motion.div
                key={light.id}
                className={`paper-card grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-2 bg-white/80 px-4 py-4 sm:gap-x-4 sm:px-5 ${
                  currentlyPlayingLight?.id === light.id
                    ? "ring-4 ring-primary"
                    : ""
                }`}
                aria-current={currentlyPlayingLight?.id === light.id ? "true" : undefined}
                {...popIn}
              >
                <span
                  role="img"
                  aria-label={light.label}
                  className={`traffic-light-indicator traffic-light-indicator--${light.id}`}
                >
                  {light.emoji}
                </span>
                <div className="min-w-0">
                  <p className="text-base font-medium leading-snug">{light.text}</p>
                  {currentlyPlayingLight?.id === light.id && (
                    <p role="status" aria-live="polite" className="mt-2 font-bold">
                      {isMuted ? "已靜音播放中" : "正在朗讀"}
                    </p>
                  )}
                </div>
                {matchingLight?.id === light.id && (
                  <button
                    type="button"
                    onClick={replayCurrentAudio}
                    aria-label={`重播${light.label}說明`}
                    className="col-start-2 min-h-12 justify-self-start rounded-xl border-2 border-text-main bg-white px-4 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    重播
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {currentCaption && !matchingLight && <AudioCaption inline />}

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
