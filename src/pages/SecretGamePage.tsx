import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { secretQuestions } from "../data/secrets";
import type { SecretQuestion } from "../data/secrets";
import { trustedAdultCards } from "../data/trustedAdult";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

type Phase = "intro" | "question" | "trusted-adults" | "complete";

export default function SecretGamePage() {
  const navigate = useNavigate();
  const { stop } = useAudioPlayer();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<SecretQuestion["answer"] | null>(null);
  const [answerResults, setAnswerResults] = useState<Array<boolean | null>>(
    () => Array(secretQuestions.length).fill(null),
  );
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  const question = secretQuestions[questionIndex];
  const answeredCount = answerResults.filter((result) => result !== null).length;
  const correctCount = answerResults.filter((result) => result === true).length;

  function startGame() {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswerResults(Array(secretQuestions.length).fill(null));
    setPhase("question");
  }

  function answer(answer: SecretQuestion["answer"]) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    setAnswerResults((results) => {
      const nextResults = [...results];
      nextResults[questionIndex] = answer === question.answer;
      return nextResults;
    });
  }

  function nextQuestion() {
    if (selectedAnswer === null) return;
    if (questionIndex === secretQuestions.length - 1) {
      setPhase("complete");
      return;
    }
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
        <div className="paper-card flex w-full max-w-lg flex-col items-center bg-warm-card p-6 text-center">
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
            className="paper-button bg-primary hover:bg-primary-hover cursor-pointer px-10 py-4 text-xl font-bold text-text-main"
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
        <div className="paper-card w-full max-w-6xl bg-warm-card p-6 sm:p-8">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold">信任的大人</h2>
            <p className="text-text-light text-base">遇到問題時，可以找這些人求助</p>
          </div>
          <div className="mx-auto grid w-full grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {trustedAdultCards.map((card) => (
              <div
                key={card.name}
                className="flex flex-col items-center"
                data-testid={`trusted-adult-${card.name}`}
              >
                <img
                  src={card.src}
                  alt={card.name}
                  className="paper-card w-full bg-white object-contain"
                />
              </div>
            ))}
          </div>
          <motion.button
            onClick={() => setPhase("question")}
            className="paper-button bg-primary hover:bg-primary-hover mt-10 cursor-pointer px-12 py-3 text-lg font-bold text-text-main"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            我知道了
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (phase === "complete") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-8">
        <div className="paper-card w-full max-w-2xl bg-warm-card p-6 sm:p-8">
          <h1 className="mb-3 text-center text-2xl font-bold sm:text-3xl">太棒了！秘密遊戲完成</h1>
          <p className="text-text-light mb-6 text-center leading-relaxed">
            每一次練習都有收穫。遇到讓你害怕或不舒服的秘密，可以說不要、離開，並告訴信任的大人。
          </p>

          <section aria-labelledby="secret-results-title" className="paper-card mb-5 bg-white p-4">
            <h2 id="secret-results-title" className="mb-2 text-lg font-bold">本次練習</h2>
            <p>已答題 {answeredCount} 題</p>
            <p>答對 {correctCount} 題</p>
          </section>

          <section aria-labelledby="secret-review-title" className="paper-card bg-warm-bg p-4">
            <h2 id="secret-review-title" className="mb-2 text-lg font-bold">重點回顧</h2>
            <ul className="list-inside list-disc space-y-2 leading-relaxed">
              <li>好秘密讓人開心、安心，不會造成傷害或讓人不舒服。</li>
              <li>遇到讓你害怕或不舒服的秘密，可以說不要、離開，並告訴信任的大人。</li>
            </ul>
          </section>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={startGame}
              className="paper-button bg-primary hover:bg-primary-hover flex-1 cursor-pointer px-6 py-3 font-bold text-text-main"
            >
              再玩一次
            </button>
            <button
              onClick={returnToMenu}
              className="paper-button bg-warm-bg hover:bg-warm-muted flex-1 cursor-pointer px-6 py-3 font-bold text-text-main"
            >
              回到主選單
            </button>
          </div>
        </div>
      </div>
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
      <h1 className="mb-6 w-full max-w-6xl text-[clamp(31px,4vw,42px)] leading-[1.2] font-bold">秘密遊戲</h1>
      <div
        className="bg-warm-bg mb-5 h-2 w-full max-w-6xl overflow-hidden rounded-full"
        role="progressbar"
        aria-label="秘密遊戲進度"
        aria-valuemin={1}
        aria-valuemax={secretQuestions.length}
        aria-valuenow={questionIndex + 1}
      >
        <div
          className="bg-primary h-full rounded-full transition-[width]"
          style={{ width: `${((questionIndex + 1) / secretQuestions.length) * 100}%` }}
        />
      </div>
      <div className="grid w-full max-w-6xl grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
        <section
          aria-label="秘密情境"
          className="paper-card flex min-w-0 flex-col items-center bg-warm-card p-4 sm:p-6"
        >
          <p className="mb-4 text-sm font-semibold">第 {questionIndex + 1} / {secretQuestions.length} 題</p>
          {imageFailed ? (
            <div
              aria-hidden={selectedAnswer !== null}
              role={selectedAnswer === null ? "img" : undefined}
              aria-label={selectedAnswer === null ? question.scenario : undefined}
              className={`mb-4 flex aspect-[1414/2000] w-full max-w-[360px] shrink-0 flex-col items-center justify-center rounded-xl p-6 text-center lg:aspect-auto lg:h-[370px] lg:max-w-[280px] ${fallbackBackgroundClass}`}
            >
              {selectedAnswer !== null && (
                <p className="mb-2 text-base font-bold text-text-main">
                  {isBad ? "壞秘密" : "好秘密"}
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
              className="mb-4 h-auto w-full max-w-[360px] shrink-0 object-contain lg:h-[370px] lg:max-w-[280px]"
              onError={() => setFailedImageSrc(imageSrc)}
            />
          )}
        </section>

        <section
          aria-label="秘密分類"
          className="paper-card flex min-w-0 flex-col items-center bg-white p-4 sm:p-6"
        >
          <h2 className="mb-5 text-center text-[clamp(26px,3vw,36px)] font-bold">學習分辨好秘密和壞秘密</h2>
          <div className="grid w-full grid-cols-2 gap-3 sm:gap-4">
            <motion.button
              onClick={() => answer("good")}
              disabled={selectedAnswer !== null}
              className="paper-choice border-b-4 border-b-primary flex min-h-[62px] cursor-pointer items-center justify-center bg-white px-4 py-3 text-[17px] font-bold disabled:cursor-default sm:min-h-[74px] sm:text-[19px]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              好秘密
            </motion.button>
            <motion.button
              onClick={() => answer("bad")}
              disabled={selectedAnswer !== null}
              className="paper-choice border-b-4 border-b-primary flex min-h-[62px] cursor-pointer items-center justify-center bg-white px-4 py-3 text-[17px] font-bold disabled:cursor-default sm:min-h-[74px] sm:text-[19px]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              壞秘密
            </motion.button>
          </div>
          {selectedAnswer !== null && (
            <div role="status" className="paper-card bg-gray-50 mt-6 w-full p-4 text-center">
              <p className="mb-2 text-lg font-bold">
                <span aria-hidden="true" className="mr-2">{isCorrect ? "✓" : "×"}</span>
                {isCorrect ? "答對了！好棒！" : "答錯了，沒關係，一起看看說明吧！"}
              </p>
              <p className="sr-only">正確答案：{isBad ? "壞秘密" : "好秘密"}。{question.explanation}</p>
            </div>
          )}
          {question.answer === "bad" && selectedAnswer !== null && (
            <>
              <section aria-label="遇到壞秘密時的安全步驟" className="paper-card bg-red-danger-bg mt-4 w-full p-4">
                <ol className="list-inside list-decimal space-y-1 font-semibold">
                  <li>說不要</li>
                  <li>離開</li>
                  <li>告訴可信任的大人</li>
                </ol>
              </section>
              <button
                onClick={openTrustedAdults}
                className="paper-button bg-primary hover:bg-primary-hover mt-4 cursor-pointer px-8 py-3 font-bold text-text-main"
              >
                誰是信任的大人？
              </button>
            </>
          )}
          {selectedAnswer !== null && (
            <button
              onClick={nextQuestion}
              className="paper-button bg-primary hover:bg-primary-hover mt-6 cursor-pointer px-10 py-3 font-bold text-text-main"
            >
              {questionIndex === secretQuestions.length - 1 ? "完成遊戲" : "下一題"}
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
    </div>
  );
}
