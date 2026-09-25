import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { secretQuestions } from "../data/secrets";
import type { SecretQuestion } from "../data/secrets";
import { trustedAdultCards } from "../data/trustedAdult";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

type Phase = "intro" | "question" | "trusted-adults";

export default function SecretGamePage() {
  const navigate = useNavigate();
  const { stop } = useAudioPlayer();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<SecretQuestion["answer"] | null>(null);
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  const question = secretQuestions[questionIndex];

  function startGame() {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setPhase("question");
  }

  function answer(answer: SecretQuestion["answer"]) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
  }

  function nextQuestion() {
    if (selectedAnswer === null || questionIndex >= secretQuestions.length - 1) return;
    setQuestionIndex((index) => index + 1);
    setSelectedAnswer(null);
  }

  function returnToMenu() {
    stop();
    navigate("/menu");
  }

  function openTrustedAdults() {
    stop();
    setPhase("trusted-adults");
  }

  if (phase === "intro") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
        <motion.h1
          className="mb-2 text-3xl font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          秘密遊戲
        </motion.h1>
        <motion.p
          className="text-text-light mb-10 text-center text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          你知道什麼是好秘密、什麼是壞秘密嗎？
        </motion.p>
        <motion.button
          onClick={startGame}
          className="bg-primary hover:bg-primary-hover cursor-pointer rounded-full px-10 py-4 text-xl font-bold text-white shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          開始作答
        </motion.button>
        <motion.button
          onClick={returnToMenu}
          className="text-text-light hover:text-primary mt-8 cursor-pointer px-6 py-3 text-sm transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ← 回到選單
        </motion.button>
      </div>
    );
  }

  if (phase === "trusted-adults") {
    return (
      <motion.div
        className="flex min-h-dvh flex-col items-center px-6 py-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold">信任的大人 💛</h2>
          <p className="text-text-light text-base">遇到問題時，可以找這些人求助</p>
        </div>
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-4 gap-6">
          {trustedAdultCards.map((card) => (
            <div
              key={card.name}
              className="flex flex-col items-center"
              data-testid={`trusted-adult-${card.name}`}
            >
              <img
                src={card.src}
                alt={card.name}
                className="w-full rounded-2xl object-contain"
              />
            </div>
          ))}
        </div>
        <motion.button
          onClick={() => setPhase("question")}
          className="bg-primary hover:bg-primary-hover mt-10 cursor-pointer rounded-full px-12 py-3 text-lg font-bold text-white shadow-md"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          我知道了
        </motion.button>
      </motion.div>
    );
  }

  if (!question) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-base">目前沒有題目，請回到選單。</p>
        <button onClick={returnToMenu} className="bg-primary rounded-full px-6 py-3 font-bold text-white">
          ← 回到選單
        </button>
      </div>
    );
  }

  const isCorrect = selectedAnswer === question.answer;
  const isBad = question.answer === "bad";
  const imageSrc = selectedAnswer === null ? question.frontImage : question.backImage;
  const imageFailed = failedImageSrc === imageSrc;
  const fallbackBackgroundClass = selectedAnswer === null
    ? "bg-warm-card"
    : isBad ? "bg-red-danger-bg" : "bg-green-safe-bg";

  return (
    <div className="flex min-h-dvh flex-col items-center px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">秘密遊戲</h1>
      <section
        aria-label="目前題目"
        className="flex w-full max-w-lg flex-col items-center rounded-2xl bg-white p-6 shadow-md"
      >
        <p className="mb-4 text-sm font-semibold">第 {questionIndex + 1} / {secretQuestions.length} 題</p>
        {imageFailed ? (
          <div
            aria-hidden={selectedAnswer !== null}
            role={selectedAnswer === null ? "img" : undefined}
            aria-label={selectedAnswer === null ? question.scenario : undefined}
            className={`mb-4 flex max-w-none shrink-0 flex-col items-center justify-center rounded-xl p-6 text-center ${fallbackBackgroundClass}`}
            style={{ width: "min(360px, calc(100vw - 3rem))", aspectRatio: "1414 / 2000" }}
          >
            {selectedAnswer !== null && (
              <p className="mb-2 text-base font-bold text-text-main">
                {isBad ? "❌ 壞秘密" : "⭕ 好秘密"}
              </p>
            )}
            <p className="text-sm leading-relaxed">
              {selectedAnswer === null ? question.scenario : question.explanation}
            </p>
          </div>
        ) : (
          <img
            src={imageSrc}
            alt={selectedAnswer === null ? question.scenario : ""}
            className="mb-4 max-w-none shrink-0 rounded-xl object-contain"
            style={{ width: "min(360px, calc(100vw - 3rem))" }}
            onError={() => setFailedImageSrc(imageSrc)}
          />
        )}
        <div className="grid w-full grid-cols-2 gap-4">
          <motion.button
            onClick={() => answer("good")}
            disabled={selectedAnswer !== null}
            className="bg-green-safe-bg flex min-h-14 cursor-pointer items-center justify-center rounded-2xl px-4 py-3 font-bold disabled:cursor-default"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            ⭕ 好秘密
          </motion.button>
          <motion.button
            onClick={() => answer("bad")}
            disabled={selectedAnswer !== null}
            className="bg-red-danger-bg flex min-h-14 cursor-pointer items-center justify-center rounded-2xl px-4 py-3 font-bold disabled:cursor-default"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            ❌ 壞秘密
          </motion.button>
        </div>
        {selectedAnswer !== null && (
          <div role="status" className="mt-6 w-full rounded-xl bg-gray-50 p-4 text-center">
            <p className="mb-2 text-lg font-bold">
              {isCorrect ? "答對了！好棒！" : "答錯了，沒關係，一起看看說明吧！"}
            </p>
            <p className="sr-only">正確答案：{isBad ? "壞秘密" : "好秘密"}。{question.explanation}</p>
          </div>
        )}
        {question.answer === "bad" && selectedAnswer !== null && (
          <>
            <section aria-label="遇到壞秘密時的安全步驟" className="mt-4 w-full rounded-xl bg-red-danger-bg p-4">
              <ol className="list-inside list-decimal space-y-1 font-semibold">
                <li>說不要</li>
                <li>離開</li>
                <li>告訴可信任的大人</li>
              </ol>
            </section>
            <button
              onClick={openTrustedAdults}
              className="bg-primary hover:bg-primary-hover mt-4 cursor-pointer rounded-full px-8 py-3 font-bold text-white shadow-md"
            >
              誰是信任的大人？
            </button>
          </>
        )}
        {questionIndex < secretQuestions.length - 1 && (
          <button
            onClick={nextQuestion}
            disabled={selectedAnswer === null}
            className="bg-primary hover:bg-primary-hover mt-6 cursor-pointer rounded-full px-10 py-3 font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            下一題
          </button>
        )}
        <button
          onClick={returnToMenu}
          className="text-text-light hover:text-primary mt-4 cursor-pointer px-6 py-2 text-sm transition-colors"
        >
          ← 回到選單
        </button>
      </section>
    </div>
  );
}
