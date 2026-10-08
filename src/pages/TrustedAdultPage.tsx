import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  trustQuestions,
  trustedAdultCards,
  type TrustQuestion,
} from "../data/trustedAdult";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useAudioContext } from "../hooks/useAudioContext";
import { AudioCaption } from "../components/AudioCaption";

type Phase = "playing" | "wrong" | "correct" | "complete";
type AnswerResult = boolean | "unscored" | null;

const trustCompletionSrc = "/audio/trust-complete.mp3";
const trustCompletionCaption =
  "太棒了！你可以找一位你覺得安全、願意聽你說的大人幫忙。\n如果第一位大人沒有相信你或沒有幫助你，可以繼續告訴下一位你覺得安全、願意聽你說的大人。";

function getAnswerFeedbackCaption(question: TrustQuestion, isCorrect: boolean) {
  if (question.roleSelection) {
    return `你可以選一位可能願意幫助你的大人。\n${question.explanation}`;
  }
  return isCorrect ? "答對了！好棒！" : `再想想看喔～${question.explanation}`;
}

export default function TrustedAdultPage() {
  const navigate = useNavigate();
  const { play, stop, isPlaying, currentSrc, currentAudioSrc } = useAudioPlayer();
  const { currentCaption, isMuted, replayCurrentAudio } = useAudioContext();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answerResults, setAnswerResults] = useState<AnswerResult[]>(
    () => Array(trustQuestions.length).fill(null),
  );
  const current: TrustQuestion | undefined = trustQuestions[index];
  const scenarioSrc = current ? `/audio/trust-q${current.id}-scenario.mp3` : null;
  const matchingScenario =
    phase === "playing" && current?.scenario === currentCaption &&
    currentAudioSrc === scenarioSrc
      ? current
      : undefined;
  const currentlyPlayingScenario = Boolean(
    matchingScenario && isPlaying && currentSrc === scenarioSrc,
  );
  const feedbackCaption =
    current && (phase === "wrong" || phase === "correct")
      ? getAnswerFeedbackCaption(current, phase === "correct")
      : null;
  const feedbackSrc =
    current && phase === "wrong"
      ? `/audio/trust-q${current.id}-wrong.mp3`
      : current && phase === "correct"
        ? `/audio/trust-q${current.id}-correct.mp3`
        : null;
  const matchingFeedback = Boolean(
    feedbackCaption && currentCaption === feedbackCaption &&
    currentAudioSrc === feedbackSrc,
  );
  const currentlyPlayingFeedback = Boolean(
    matchingFeedback && isPlaying && currentSrc === feedbackSrc,
  );
  const matchingCompletion =
    phase === "complete" && currentCaption === trustCompletionCaption &&
    currentAudioSrc === trustCompletionSrc;
  const currentlyPlayingCompletion = Boolean(
    matchingCompletion && isPlaying && currentSrc === trustCompletionSrc,
  );
  const showFallbackCaption = Boolean(
    currentCaption && !matchingScenario && !matchingFeedback && !matchingCompletion,
  );
  const answeredCount = answerResults.filter((result) => result !== null).length;
  const correctCount = answerResults.filter((result) => result === true).length;

  useEffect(() => {
    if (phase !== "playing" || !current) return;
    play(`/audio/trust-q${current.id}-scenario.mp3`, { caption: current.scenario });
  }, [index, phase, current, play]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const advance = useCallback(() => {
    if (index + 1 >= trustQuestions.length) {
      setPhase("complete");
      play(trustCompletionSrc, {
        caption: trustCompletionCaption,
      });
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
    const isCorrect = current.roleSelection || optionIndex === current.correctIndex;
    const answerResult: AnswerResult = current.roleSelection ? "unscored" : isCorrect;
    setAnswerResults((results) => {
      if (
        results[index] === true ||
        results[index] === "unscored" ||
        (results[index] === false && answerResult === false)
      ) return results;
      const nextResults = [...results];
      nextResults[index] = answerResult;
      return nextResults;
    });
    if (isCorrect) {
      setPhase("correct");
      play(`/audio/trust-q${current.id}-correct.mp3`, {
        onEnd: advance,
        caption: getAnswerFeedbackCaption(current, true),
      });
    } else {
      setPhase("wrong");
      play(`/audio/trust-q${current.id}-wrong.mp3`, {
        caption: getAnswerFeedbackCaption(current, false),
      });
    }
  }

  function handleRetry() {
    setPhase("playing");
    setSelectedIndex(null);
    play(`/audio/trust-q${current!.id}-scenario.mp3`, { caption: current!.scenario });
  }

  function handleReplay() {
    stop();
    setIndex(0);
    setPhase("playing");
    setSelectedIndex(null);
    setAnswerResults(Array(trustQuestions.length).fill(null));
  }

  if (phase === "complete") {
    return (
      <motion.div
        className="flex min-h-dvh flex-col items-center justify-start px-6 py-8 pb-28 text-center max-[420px]:pb-[calc(17rem+env(safe-area-inset-bottom))]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="paper-card w-full max-w-3xl bg-warm-card p-4 sm:p-8">
          <h1 className="mb-3 text-3xl font-bold">太棒了！</h1>
          <section aria-labelledby="trusted-results-title" className="paper-card mb-5 bg-white p-4 text-left">
            <h2 id="trusted-results-title" className="mb-2 text-lg font-bold">本次練習</h2>
            <div className="grid grid-cols-2 gap-2 text-sm sm:text-base">
              <p>已答題 {answeredCount} 題</p>
              <p>答對 {correctCount} 題</p>
              {answerResults.includes("unscored") && (
                <p className="text-text-light col-span-2 text-xs">求助對象選擇不列入答對題數</p>
              )}
            </div>
          </section>
          <section
            aria-labelledby="trusted-review-title"
            className={`paper-card mb-3 bg-warm-bg p-4 text-left ${
              currentlyPlayingCompletion ? "ring-4 ring-primary" : ""
            }`}
            aria-current={currentlyPlayingCompletion ? "true" : undefined}
          >
            <h2 id="trusted-review-title" className="mb-2 text-lg font-bold">重點回顧</h2>
            <p className="text-text-light leading-relaxed whitespace-pre-line">
              {trustCompletionCaption}
            </p>
            {currentlyPlayingCompletion && (
              <p role="status" aria-live="polite" className="mt-3 text-center font-bold">
                {isMuted ? "已靜音播放中" : "正在朗讀"}
              </p>
            )}
            {matchingCompletion && (
              <button
                type="button"
                onClick={replayCurrentAudio}
                aria-label="重播回顧語音"
                className="mt-3 min-h-12 rounded-xl border-2 border-text-main bg-white px-4 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                重播
              </button>
            )}
          </section>
          <div className="flex flex-col gap-3 min-[360px]:flex-row min-[360px]:gap-2">
            <motion.button
              type="button"
              onClick={handleReplay}
              className="paper-button bg-primary hover:bg-primary-hover flex-1 cursor-pointer px-3 py-3 text-base font-bold text-text-main sm:px-8 sm:py-4 sm:text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              再玩一次
            </motion.button>
            <motion.button
              type="button"
              onClick={() => {
                stop();
                navigate("/menu");
              }}
              className="paper-button bg-warm-bg hover:bg-warm-muted flex-1 cursor-pointer px-3 py-3 text-base font-bold text-text-main sm:px-8 sm:py-4 sm:text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              回到主選單
            </motion.button>
          </div>
        </div>
        {showFallbackCaption && <AudioCaption inline />}
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

        <div
          className="bg-warm-bg mb-2 h-2 w-full overflow-hidden rounded-full"
          role="progressbar"
          aria-label="信任大人答題進度"
          aria-valuemin={1}
          aria-valuemax={trustQuestions.length}
          aria-valuenow={index + 1}
        >
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
              className={`paper-card bg-warm-card mt-6 p-6 sm:p-8 ${
                currentlyPlayingScenario ? "ring-4 ring-primary" : ""
              }`}
              aria-current={currentlyPlayingScenario ? "true" : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-6 text-center text-lg leading-relaxed">
                {current.scenario}
              </p>
              {currentlyPlayingScenario && (
                <p role="status" aria-live="polite" className="mb-4 text-center font-bold">
                  {isMuted ? "已靜音播放中" : "正在朗讀"}
                </p>
              )}
              {matchingScenario && (
                <button
                  type="button"
                  onClick={replayCurrentAudio}
                  aria-label="重播情境語音"
                  className="mb-6 min-h-12 rounded-xl border-2 border-text-main bg-white px-4 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  重播
                </button>
              )}

              {phase === "correct" && (
                <motion.div
                  className={`paper-card mb-4 bg-green-safe-bg p-4 text-center ${
                    currentlyPlayingFeedback ? "ring-4 ring-primary" : ""
                  }`}
                  aria-current={currentlyPlayingFeedback ? "true" : undefined}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div role="status" aria-live="polite">
                    <p className="text-text-main text-lg font-bold">
                      <span aria-hidden="true" className="mr-2">✓</span>
                      {current.roleSelection
                        ? "你可以選一位可能願意幫助你的大人。"
                        : "答對了！好棒！"}
                    </p>
                    {current.roleSelection && (
                      <p className="text-text-light mt-2 text-sm leading-relaxed">
                        {current.explanation}
                      </p>
                    )}
                    {currentlyPlayingFeedback && (
                      <p className="mt-3 font-bold">
                        {isMuted ? "已靜音播放中" : "正在朗讀"}
                      </p>
                    )}
                  </div>
                  {matchingFeedback && (
                    <button
                      type="button"
                      onClick={replayCurrentAudio}
                      aria-label="重播回饋語音"
                      className="mt-3 min-h-12 rounded-xl border-2 border-text-main bg-white px-4 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      重播
                    </button>
                  )}
                </motion.div>
              )}

              {phase === "wrong" && (
                <motion.div
                  className={`paper-card bg-red-danger-bg mb-4 p-4 ${
                    currentlyPlayingFeedback ? "ring-4 ring-primary" : ""
                  }`}
                  aria-current={currentlyPlayingFeedback ? "true" : undefined}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div role="status" aria-live="polite">
                    <p className="text-text-main mb-1 text-center text-base font-bold">
                      <span aria-hidden="true" className="mr-2">×</span>
                      再想想看喔～
                    </p>
                    <p className="text-text-light text-center text-sm">
                      {current.explanation}
                    </p>
                    {currentlyPlayingFeedback && (
                      <p className="mt-3 text-center font-bold">
                        {isMuted ? "已靜音播放中" : "正在朗讀"}
                      </p>
                    )}
                  </div>
                  {matchingFeedback && (
                    <button
                      type="button"
                      onClick={replayCurrentAudio}
                      aria-label="重播回饋語音"
                      className="mt-3 min-h-12 rounded-xl border-2 border-text-main bg-white px-4 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      重播
                    </button>
                  )}
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
      {showFallbackCaption && <AudioCaption inline />}
    </div>
  );
}
