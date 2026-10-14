import { useState, useEffect, useCallback, useRef } from "react";
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
type FeedbackFocusTarget = "reopen" | "answer" | "question" | "complete" | null;

const trustCompletionSrc = "/audio/trust-complete.mp3";
const trustCompletionCaption =
  "太棒了！你可以找一位你覺得安全、願意聽你說的大人幫忙。\n如果第一位大人沒有相信你或沒有幫助你，可以繼續告訴下一位你覺得安全、願意聽你說的大人。";

const trustOptionAudioByQuestion: Record<number, readonly string[]> = {
  1: [
    "/audio/ho3527-temp-free/trust-q1-option-1.mp3",
    "/audio/ho3527-temp-free/trust-q1-option-2.mp3",
    "/audio/ho3527-temp-free/trust-q1-option-3.mp3",
  ],
  2: [
    "/audio/ho3527-temp-free/trust-q2-option-1.mp3",
    "/audio/ho3527-temp-free/trust-q2-option-2.mp3",
    "/audio/ho3527-temp-free/trust-q2-option-3.mp3",
  ],
  3: [
    "/audio/ho3527-temp-free/trust-q3-option-1.mp3",
    "/audio/ho3527-temp-free/trust-q3-option-2.mp3",
    "/audio/ho3527-temp-free/trust-q3-option-3.mp3",
  ],
  4: [
    "/audio/ho3527-temp-free/trust-q4-option-1.mp3",
    "/audio/ho3527-temp-free/trust-q4-option-2.mp3",
    "/audio/ho3527-temp-free/trust-q4-option-3.mp3",
  ],
  5: [
    "/audio/ho3527-temp-free/trust-q5-role-mom.mp3",
    "/audio/ho3527-temp-free/trust-q5-role-dad.mp3",
    "/audio/ho3527-temp-free/trust-q5-role-grandma.mp3",
    "/audio/ho3527-temp-free/trust-q5-role-teacher.mp3",
    "/audio/ho3527-temp-free/trust-q5-role-police.mp3",
    "/audio/ho3527-temp-free/trust-q5-role-relatives.mp3",
    "/audio/ho3527-temp-free/trust-q5-role-neighbors.mp3",
    "/audio/ho3527-temp-free/trust-q5-role-moms-boyfriend.mp3",
  ],
};

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
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [answerResults, setAnswerResults] = useState<AnswerResult[]>(
    () => Array(trustQuestions.length).fill(null),
  );
  const feedbackDialogRef = useRef<HTMLDialogElement>(null);
  const feedbackTriggerRef = useRef<HTMLButtonElement>(null);
  const answerButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const retryFocusIndexRef = useRef<number | null>(null);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const completionHeadingRef = useRef<HTMLHeadingElement>(null);
  const focusAfterCloseRef = useRef<FeedbackFocusTarget>(null);
  const answerSubmittedRef = useRef(false);
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

  useEffect(() => {
    const dialog = feedbackDialogRef.current;
    if (!dialog) return;
    if (feedbackOpen && !dialog.open) {
      dialog.showModal();
      dialog.focus();
    } else if (!feedbackOpen && dialog.open) {
      dialog.close();
    }
  }, [feedbackOpen]);

  useEffect(() => {
    if (feedbackOpen) return;
    const target = focusAfterCloseRef.current;
    if (!target) return;
    const frame = window.requestAnimationFrame(() => {
      if (focusAfterCloseRef.current !== target) return;
      if (target === "reopen") feedbackTriggerRef.current?.focus();
      if (target === "answer") {
        answerButtonRefs.current[retryFocusIndexRef.current ?? 0]?.focus();
        retryFocusIndexRef.current = null;
      }
      if (target === "question") questionHeadingRef.current?.focus();
      if (target === "complete") completionHeadingRef.current?.focus();
      focusAfterCloseRef.current = null;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [feedbackOpen, index, phase]);

  const advance = useCallback(() => {
    const completesQuiz = index + 1 >= trustQuestions.length;
    focusAfterCloseRef.current = completesQuiz ? "complete" : "question";
    feedbackDialogRef.current?.close();
    setFeedbackOpen(false);
    answerSubmittedRef.current = false;
    if (completesQuiz) {
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
    if (phase !== "playing" || !current || answerSubmittedRef.current) return;
    answerSubmittedRef.current = true;
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
      setFeedbackOpen(true);
      play(`/audio/trust-q${current.id}-correct.mp3`, {
        onEnd: advance,
        caption: getAnswerFeedbackCaption(current, true),
      });
    } else {
      setPhase("wrong");
      setFeedbackOpen(true);
      play(`/audio/trust-q${current.id}-wrong.mp3`, {
        caption: getAnswerFeedbackCaption(current, false),
      });
    }
  }

  function handleConfirm() {
    if (selectedIndex !== null) handleAnswer(selectedIndex);
  }

  function handleSelectOption(optionIndex: number) {
    if (phase !== "playing" || !current) return;
    const optionLabel = current.roleSelection
      ? trustedAdultCards[optionIndex]?.name
      : current.options[optionIndex];
    const audioSrc = trustOptionAudioByQuestion[current.id]?.[optionIndex];
    if (!optionLabel || !audioSrc) return;
    setSelectedIndex(optionIndex);
    play(audioSrc, { caption: optionLabel });
  }

  function handleRetry() {
    focusAfterCloseRef.current = "answer";
    retryFocusIndexRef.current = selectedIndex;
    answerSubmittedRef.current = false;
    setFeedbackOpen(false);
    setPhase("playing");
    setSelectedIndex(null);
    play(`/audio/trust-q${current!.id}-scenario.mp3`, { caption: current!.scenario });
  }

  function dismissFeedback() {
    focusAfterCloseRef.current = "reopen";
    feedbackDialogRef.current?.close();
    setFeedbackOpen(false);
  }

  function handleReplay() {
    stop();
    answerSubmittedRef.current = false;
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
          <h1 ref={completionHeadingRef} tabIndex={-1} className="mb-3 text-3xl font-bold">太棒了！</h1>
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
              <p role="status" aria-live="polite" className="sr-only">
                {isMuted ? "已靜音播放中" : "正在朗讀"}
              </p>
            )}
            {matchingCompletion && (
              <button
                type="button"
                onClick={replayCurrentAudio}
                aria-label="重播回顧語音"
                data-playing={currentlyPlayingCompletion}
                aria-pressed={currentlyPlayingCompletion}
                className="mx-auto mt-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-text-main bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="currentColor">
                  {currentlyPlayingCompletion ? (
                    <path d="M3 9h3v6H3zm5-4h3v14H8zm6 2h3v10h-3zm6 3h3v4h-3z" />
                  ) : (
                    <path d="M8 5v14l11-7z" />
                  )}
                </svg>
              </button>
            )}
          </section>
          {showFallbackCaption && <AudioCaption inline />}
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
          <h1 ref={questionHeadingRef} tabIndex={-1} className="mb-2 text-2xl font-bold">信任大人</h1>
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
                <p role="status" aria-live="polite" className="sr-only">
                  {isMuted ? "已靜音播放中" : "正在朗讀"}
                </p>
              )}
              {phase === "playing" && (
                <button
                  type="button"
                  onClick={() => play(`/audio/trust-q${current.id}-scenario.mp3`, { caption: current.scenario })}
                  aria-label="重播情境語音"
                  data-playing={currentlyPlayingScenario}
                  aria-pressed={currentlyPlayingScenario}
                  className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border-2 border-text-main bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="currentColor">
                    {currentlyPlayingScenario ? (
                      <path d="M3 9h3v6H3zm5-4h3v14H8zm6 2h3v10h-3zm6 3h3v4h-3z" />
                    ) : (
                      <path d="M8 5v14l11-7z" />
                    )}
                  </svg>
                </button>
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
                        ref={(element) => { answerButtonRefs.current[i] = element; }}
                        type="button"
                        onClick={() => handleSelectOption(i)}
                        aria-label={card.name}
                        aria-pressed={isSelected}
                        style={
                          isSelected && phase === "playing"
                            ? { borderColor: "var(--color-primary)" }
                            : undefined
                        }
                        className={`paper-choice flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 p-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                          isSelected
                            ? phase === "playing"
                              ? "bg-primary/20 text-text-main"
                              : "border-green-safe bg-green-safe-bg text-text-main"
                            : "border-transparent bg-warm-bg hover:border-primary"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={phase !== "playing"}
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
                <div role="group" aria-label="選擇答案" className="flex flex-col gap-3">
                  {current.options.map((option, i) => {
                    const isSelected = selectedIndex === i;
                    const isCorrect = i === current.correctIndex;
                    const showResult = phase === "wrong" || phase === "correct";
                    let buttonClass =
                      "paper-choice flex min-h-12 w-full items-center justify-between gap-4 cursor-pointer px-4 py-4 text-left text-base font-bold transition-colors";
                    if (!showResult) {
                      buttonClass += isSelected
                        ? " bg-primary/20 text-text-main"
                        : " bg-warm-bg hover:bg-primary/20";
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
                        ref={(element) => { answerButtonRefs.current[i] = element; }}
                        type="button"
                        onClick={() => handleSelectOption(i)}
                        aria-pressed={isSelected}
                        style={
                          isSelected && !showResult
                            ? { borderColor: "var(--color-primary)" }
                            : undefined
                        }
                        className={buttonClass}
                        whileHover={phase !== "correct" ? { scale: 1.02 } : {}}
                        whileTap={phase !== "correct" ? { scale: 0.97 } : {}}
                        disabled={phase !== "playing"}
                      >
                        <span>{option}</span>
                        <span
                          aria-hidden="true"
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? "border-primary bg-primary text-white"
                              : "border-text-main bg-white"
                          }`}
                        >
                          {isSelected ? "✓" : null}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {phase === "playing" && (
                <motion.button
                  type="button"
                  onClick={handleConfirm}
                  disabled={selectedIndex === null}
                  className="paper-button bg-primary hover:bg-primary-hover disabled:hover:bg-warm-muted mt-4 w-full cursor-pointer py-3 font-bold text-text-main disabled:cursor-not-allowed disabled:bg-warm-muted disabled:text-text-light"
                  whileHover={selectedIndex !== null ? { scale: 1.02 } : {}}
                  whileTap={selectedIndex !== null ? { scale: 0.97 } : {}}
                >
                  確認
                </motion.button>
              )}

              {(phase === "wrong" || phase === "correct") && !feedbackOpen && (
                <button
                  ref={feedbackTriggerRef}
                  type="button"
                  onClick={() => setFeedbackOpen(true)}
                  aria-haspopup="dialog"
                  aria-controls="trusted-adult-feedback-dialog"
                  className="paper-button bg-warm-bg hover:bg-warm-muted mt-4 w-full cursor-pointer py-3 font-bold text-text-main"
                >
                  查看答題結果
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <dialog
        ref={feedbackDialogRef}
        id="trusted-adult-feedback-dialog"
        className="trusted-adult-feedback"
        tabIndex={-1}
        aria-labelledby="trusted-adult-feedback-title"
        aria-describedby={
          current && (phase === "wrong" || (phase === "correct" && current.roleSelection))
            ? "trusted-adult-feedback-explanation"
            : undefined
        }
        onCancel={(event) => {
          event.preventDefault();
          dismissFeedback();
        }}
        onClose={() => setFeedbackOpen(false)}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const focusables = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          );
          if (!focusables.length) {
            event.preventDefault();
            event.currentTarget.focus();
            return;
          }
          if (document.activeElement === event.currentTarget) {
            event.preventDefault();
            (event.shiftKey ? focusables.at(-1) : focusables[0])?.focus();
          } else if (event.shiftKey && document.activeElement === focusables[0]) {
            event.preventDefault();
            focusables.at(-1)?.focus();
          } else if (!event.shiftKey && document.activeElement === focusables.at(-1)) {
            event.preventDefault();
            focusables[0]?.focus();
          }
        }}
      >
        <button
          type="button"
          onClick={dismissFeedback}
          aria-label="關閉答題結果"
          className="trusted-adult-feedback__close"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
        {current && (phase === "wrong" || phase === "correct") && (
          <>
            <section
              className={`paper-card p-5 text-center ${
                phase === "wrong" ? "bg-red-danger-bg" : "bg-green-safe-bg"
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <span aria-hidden="true" className="text-[28px] font-black leading-none">
                  {phase === "correct" ? "✓" : "×"}
                </span>
                <h2
                  id="trusted-adult-feedback-title"
                  role={phase === "wrong" ? "status" : undefined}
                  aria-live={phase === "wrong" ? "polite" : undefined}
                  className="text-text-main text-xl font-bold"
                >
                  {phase === "correct"
                    ? current.roleSelection
                      ? "你可以選一位可能願意幫助你的大人。"
                      : "答對了！好棒！"
                    : "再想想看喔～"}
                </h2>
              </div>

              {(phase === "wrong" || current.roleSelection) && (
                <p
                  id="trusted-adult-feedback-explanation"
                  className="text-text-light mt-3 text-sm leading-relaxed"
                >
                  {current.explanation}
                </p>
              )}

              {phase === "wrong" && currentlyPlayingFeedback && (
                <p role="status" aria-live="polite" className="sr-only">
                  {isMuted ? "已靜音播放中" : "正在朗讀"}
                </p>
              )}

              {phase === "wrong" && matchingFeedback && (
                <button
                  type="button"
                  onClick={replayCurrentAudio}
                  aria-label="重播回饋語音"
                  data-playing={currentlyPlayingFeedback}
                  aria-pressed={currentlyPlayingFeedback}
                  className="mx-auto mt-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-text-main bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="currentColor">
                    {currentlyPlayingFeedback ? (
                      <path d="M3 9h3v6H3zm5-4h3v14H8zm6 2h3v10h-3zm6 3h3v4h-3z" />
                    ) : (
                      <path d="M8 5v14l11-7z" />
                    )}
                  </svg>
                </button>
              )}
            </section>

            {phase === "wrong" && (
              <button
                type="button"
                onClick={handleRetry}
                className="paper-button bg-primary hover:bg-primary-hover mt-4 w-full cursor-pointer py-3 font-bold text-text-main"
              >
                再試一次
              </button>
            )}
          </>
        )}
      </dialog>
    </div>
  );
}
