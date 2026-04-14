import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { secretQuestions, type SecretQuestion } from "../data/secrets";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

type Phase = "playing" | "correct" | "wrong" | "complete";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SecretGamePage() {
  const navigate = useNavigate();
  const { play, stop } = useAudioPlayer();
  const questions = useMemo(() => shuffle(secretQuestions), []);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current: SecretQuestion | undefined = questions[index];

  useEffect(() => {
    if (phase !== "playing" || !current) return;
    play(`/audio/secret-q${current.id}-scenario.mp3`);
  }, [index, phase, current, play]);

  useEffect(() => {
    return () => {
      stop();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stop]);

  const advance = useCallback(() => {
    if (index + 1 >= questions.length) {
      setPhase("complete");
    } else {
      setIndex((i) => i + 1);
      setPhase("playing");
    }
  }, [index, questions.length]);

  function handleAnswer(choice: "good" | "bad") {
    if (phase !== "playing" || !current) return;
    stop();

    if (choice === current.answer) {
      setScore((s) => s + 1);
      setPhase("correct");
      play(`/audio/secret-q${current.id}-correct.mp3`);
      timerRef.current = setTimeout(advance, 2000);
    } else {
      setPhase("wrong");
      play(`/audio/secret-q${current.id}-wrong.mp3`);
    }
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
          className="mb-6 text-7xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          🎉
        </motion.div>
        <h1 className="mb-3 text-3xl font-bold">遊戲完成！</h1>
        <p className="text-text-light mb-2 text-lg">
          你答對了 <span className="text-primary font-bold">{score}</span> / {questions.length} 題
        </p>
        <p className="text-text-light mb-10 text-base">
          {score === questions.length
            ? "太厲害了，全部答對！"
            : score >= 4
              ? "表現得很棒！"
              : "沒關係，下次會更好！"}
        </p>
        <motion.button
          onClick={() => navigate("/ending")}
          className="bg-primary hover:bg-primary-hover cursor-pointer rounded-full px-10 py-4 text-lg font-bold text-white shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          完成
        </motion.button>
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
          <h1 className="mb-2 text-2xl font-bold">秘密遊戲 🔑</h1>
          <p className="text-text-light text-sm">
            第 {index + 1} / {questions.length} 題
          </p>
        </motion.div>

        <div className="bg-warm-bg mb-2 h-2 w-full overflow-hidden rounded-full">
          <motion.div
            className="bg-primary h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((index + 1) / questions.length) * 100}%` }}
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
              <p className="mb-8 text-center text-lg leading-relaxed">
                {current.scenario}
              </p>

              {phase === "playing" && (
                <div className="flex gap-4">
                  <motion.button
                    onClick={() => handleAnswer("good")}
                    className="bg-green-safe-bg flex-1 cursor-pointer rounded-xl px-4 py-4 text-lg font-bold"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    ⭕ 好秘密
                  </motion.button>
                  <motion.button
                    onClick={() => handleAnswer("bad")}
                    className="bg-red-danger-bg flex-1 cursor-pointer rounded-xl px-4 py-4 text-lg font-bold"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    ❌ 壞秘密
                  </motion.button>
                </div>
              )}

              {phase === "correct" && (
                <motion.div
                  className="mt-4 text-center"
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
                  className="mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-red-danger-bg mb-4 rounded-xl p-4 text-center">
                    <p className="text-red-danger mb-1 text-base font-bold">
                      不太對喔～
                    </p>
                    <p className="text-text-light text-sm">
                      {current.explanation}
                    </p>
                  </div>
                  <motion.button
                    onClick={advance}
                    className="bg-primary hover:bg-primary-hover w-full cursor-pointer rounded-full py-3 font-bold text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    我知道了
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
