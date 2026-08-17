import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { trustQuestions, type TrustQuestion } from "../data/trustedAdult";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

type Phase = "playing" | "wrong" | "correct" | "complete";

export default function TrustedAdultPage() {
  const navigate = useNavigate();
  const { play, stop } = useAudioPlayer();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
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
    if (phase !== "playing" || !current) return;
    stop();
    setSelectedIndex(optionIndex);
    if (optionIndex === current.correctIndex) {
      setScore((n) => n + 1);
      setPhase("correct");
      play(`/audio/trust-q${current.id}-correct.mp3`);
      timerRef.current = setTimeout(advance, 2200);
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
        className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="completion-icon mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          ✓
        </motion.div>
        <h1 className="mb-3 text-3xl font-bold">信任大人完成！</h1>
        <p className="mb-3 text-xl font-bold">你答對了 {score} / {trustQuestions.length} 題</p>
        <p className="text-text-light mb-10 text-lg leading-relaxed">
          你學會了怎麼找到可以信任的大人！<br />
          如果第一位大人沒有相信你或沒有幫助你，<br />
          也可以繼續告訴下一位可信任的大人。
        </p>
        <div className="button-row">
        <motion.button
          onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); setIndex(0); setScore(0); setSelectedIndex(null); setPhase("playing"); }}
          className="primary-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          再玩一次
        </motion.button>
        <button className="secondary-button" onClick={() => navigate("/menu")}>回主選單</button>
        <button className="secondary-button" onClick={() => navigate("/ending")}>完成</button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between gap-3">
            <h1 className="mb-2 text-2xl font-bold">信任大人</h1>
            <div className="button-row compact">
              <button className="text-button" onClick={() => document.documentElement.requestFullscreen?.()}>全螢幕</button>
              <button className="text-button" onClick={() => navigate("/menu")}>回主選單</button>
            </div>
          </div>
          <p className="text-text-light text-sm">
            第 {index + 1} / {trustQuestions.length} 題 · 答對 {score} 題
          </p>
        </motion.div>

        <div className="facilitator-bar">
          <label>
            選擇題目
            <select aria-label="選擇信任大人題目" value={index} onChange={(event) => { if (timerRef.current) clearTimeout(timerRef.current); setIndex(Number(event.target.value)); setPhase("playing"); setSelectedIndex(null); }}>
              {trustQuestions.map((question, questionIndex) => <option key={question.id} value={questionIndex}>第 {questionIndex + 1} 題</option>)}
            </select>
          </label>
          <button className="secondary-button" onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); setIndex(0); setScore(0); setPhase("playing"); setSelectedIndex(null); }}>重新開始</button>
        </div>

        <div className="progress-track">
          <motion.div
            className="progress-value"
            initial={{ width: 0 }}
            animate={{ width: `${((index + 1) / trustQuestions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              className="bg-warm-card mt-6 rounded-2xl p-8 shadow-md"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4 text-center text-4xl">🤔</div>
              <p className="mb-6 text-center text-lg leading-relaxed">
                {current.scenario}
              </p>

              {phase === "correct" && (
                <motion.div
                  className="mb-4 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div
                    className="mb-3 text-5xl"
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 20, -20, 0] }}
                    transition={{ duration: 0.6 }}
                  >
                    ⭐
                  </motion.div>
                  <p className="text-green-safe text-lg font-bold">
                    答對了！好棒！
                  </p>
                </motion.div>
              )}

              {phase === "wrong" && (
                <motion.div
                  className="bg-red-danger-bg mb-4 rounded-xl p-4"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-red-danger mb-1 text-center text-base font-bold">
                    再想想看喔～
                  </p>
                  <p className="text-text-light text-center text-sm">
                    {current.explanation}
                  </p>
                </motion.div>
              )}

              <div className="flex flex-col gap-3">
                {current.options.map((option, i) => {
                  const isSelected = selectedIndex === i;
                  const isCorrect = i === current.correctIndex;
                  const showResult = phase === "wrong" || phase === "correct";
                  let buttonClass =
                    "w-full cursor-pointer rounded-xl px-4 py-4 text-base font-bold text-left transition-colors";
                  if (!showResult) {
                    buttonClass += " bg-warm-bg hover:bg-primary hover:text-white";
                  } else if (phase === "correct" && isCorrect) {
                    buttonClass += " bg-green-safe-bg text-green-safe";
                  } else if (phase === "wrong" && isSelected) {
                    buttonClass += " bg-red-danger-bg text-red-danger";
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

              {phase === "wrong" && (
                <motion.button
                  onClick={handleRetry}
                  className="bg-primary hover:bg-primary-hover mt-4 w-full cursor-pointer rounded-full py-3 font-bold text-white"
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
