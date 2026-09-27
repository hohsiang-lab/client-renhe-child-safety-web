import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  trustQuestions,
  trustedAdultCards,
  type TrustQuestion,
} from "../data/trustedAdult";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

type Phase = "playing" | "wrong" | "correct" | "complete";

export default function TrustedAdultPage() {
  const navigate = useNavigate();
  const { play, stop } = useAudioPlayer();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current: TrustQuestion | undefined = trustQuestions[index];

  useEffect(() => {
    if (phase !== "playing" || !current) return;
    play(`/audio/trust-q${current.id}-scenario.mp3`);
  }, [index, phase, current, play]);

  useEffect(() => {
    return () => {
      stop();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stop]);

  const advance = useCallback(() => {
    if (index + 1 >= trustQuestions.length) {
      setPhase("complete");
      play("/audio/trust-complete.mp3");
    } else {
      setIndex((i) => i + 1);
      setPhase("playing");
      setSelectedIndex(null);
    }
  }, [index, play]);

  function handleAnswer(optionIndex: number) {
    if (phase === "correct" || !current) return;
    stop();
    setSelectedIndex(optionIndex);
    if (current.roleSelection || optionIndex === current.correctIndex) {
      setPhase("correct");
      play(`/audio/trust-q${current.id}-correct.mp3`);
      timerRef.current = setTimeout(advance, current.roleSelection ? 4000 : 2200);
    } else {
      setPhase("wrong");
      play(`/audio/trust-q${current.id}-wrong.mp3`);
    }
  }

  function handleRetry() {
    setPhase("playing");
    setSelectedIndex(null);
    play(`/audio/trust-q${current!.id}-scenario.mp3`);
  }

  if (phase === "complete") {
    return (
      <motion.div
        className="flex min-h-dvh flex-col items-center justify-center px-6 py-8 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="paper-card w-full max-w-3xl bg-warm-card p-6 sm:p-8">
          <h1 className="mb-3 text-3xl font-bold">太棒了！</h1>
          <p className="text-text-light mb-8 text-lg leading-relaxed">
            你可以找一位你覺得安全、願意聽你說的大人幫忙。<br />
            如果第一位大人沒有相信你或沒有幫助你，可以繼續告訴下一位你覺得安全、願意聽你說的大人。
          </p>
          <motion.button
            onClick={() => navigate("/menu")}
            className="paper-button bg-primary hover:bg-primary-hover cursor-pointer px-10 py-4 text-lg font-bold text-text-main"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            回到主選單
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className={`w-full ${current?.roleSelection ? "max-w-2xl" : "max-w-lg"}`}>
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="mb-2 text-2xl font-bold">信任大人</h1>
          <p className="text-text-light text-sm">
            第 {index + 1} / {trustQuestions.length} 題
          </p>
        </motion.div>

        <div className="bg-warm-bg mb-2 h-2 w-full overflow-hidden rounded-full">
          <motion.div
            className="bg-primary h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((index + 1) / trustQuestions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              className="paper-card bg-warm-card mt-6 p-6 sm:p-8"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-6 text-center text-lg leading-relaxed">
                {current.scenario}
              </p>

              {phase === "correct" && (
                <motion.div
                  role="status"
                  aria-live="polite"
                  className="paper-card mb-4 bg-green-safe-bg p-4 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <p className="text-text-main text-lg font-bold">
                    {current.roleSelection
                      ? "你可以選一位可能願意幫助你的大人。"
                      : "答對了！好棒！"}
                  </p>
                  {current.roleSelection && (
                    <p className="text-text-light mt-2 text-sm leading-relaxed">
                      {current.explanation}
                    </p>
                  )}
                </motion.div>
              )}

              {phase === "wrong" && (
                <motion.div
                  className="paper-card bg-red-danger-bg mb-4 p-4"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-text-main mb-1 text-center text-base font-bold">
                    再想想看喔～
                  </p>
                  <p className="text-text-light text-center text-sm">
                    {current.explanation}
                  </p>
                </motion.div>
              )}

              {current.roleSelection ? (
                <div
                  role="group"
                  aria-label="選擇可能求助的大人"
                  className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                >
                  {trustedAdultCards.map((card, i) => {
                    const isSelected = selectedIndex === i;
                    return (
                      <motion.button
                        key={card.src}
                        type="button"
                        onClick={() => handleAnswer(i)}
                        aria-label={card.name}
                        aria-pressed={isSelected}
                        className={`paper-choice flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 p-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                          isSelected
                            ? "border-green-safe bg-green-safe-bg text-text-main"
                            : "border-transparent bg-warm-bg hover:border-primary"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={phase === "correct"}
                      >
                        <img
                          src={card.src}
                          alt=""
                          aria-hidden="true"
                          className="h-36 w-full object-contain"
                        />
                        {isSelected && <span className="text-xs">✓ 已選擇</span>}
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {current.options.map((option, i) => {
                    const isSelected = selectedIndex === i;
                    const isCorrect = i === current.correctIndex;
                    const showResult = phase === "wrong" || phase === "correct";
                    let buttonClass =
                      "paper-choice w-full cursor-pointer px-4 py-4 text-left text-base font-bold transition-colors";
                    if (!showResult) {
                      buttonClass += " bg-warm-bg hover:bg-primary hover:text-white";
                    } else if (phase === "correct" && isCorrect) {
                      buttonClass += " bg-green-safe-bg text-text-main";
                    } else if (phase === "wrong" && isSelected) {
                      buttonClass += " bg-red-danger-bg text-text-main";
                    } else {
                      buttonClass += " bg-warm-bg opacity-60";
                    }
                    return (
                      <motion.button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className={buttonClass}
                        whileHover={phase !== "correct" ? { scale: 1.02 } : {}}
                        whileTap={phase !== "correct" ? { scale: 0.97 } : {}}
                        disabled={phase === "correct"}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {phase === "wrong" && (
                <motion.button
                  onClick={handleRetry}
                  className="paper-button bg-primary hover:bg-primary-hover mt-4 w-full cursor-pointer py-3 font-bold text-text-main"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  再試一次
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
