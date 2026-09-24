import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { networkSafetyQuestions } from "../data/networkSafety";

type Screen = "intro" | "question" | "complete";
type AnswerState = "unanswered" | "wrong" | "correct";

export default function NetworkSafetyPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("intro");
  const [index, setIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const current = networkSafetyQuestions[index]!;

  function handleAnswer(optionIndex: number) {
    if (answerState === "correct") return;
    setSelectedIndex(optionIndex);
    setAnswerState(optionIndex === current.correctIndex ? "correct" : "wrong");
  }

  function handleRetry() {
    setSelectedIndex(null);
    setAnswerState("unanswered");
  }

  function handleNext() {
    if (index + 1 === networkSafetyQuestions.length) {
      setScreen("complete");
      return;
    }
    setIndex((currentIndex) => currentIndex + 1);
    setSelectedIndex(null);
    setAnswerState("unanswered");
  }

  if (screen === "intro") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12 text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-4 text-3xl font-bold">網路安全小任務</h1>
          <p className="text-text-light mx-auto mb-8 max-w-lg text-lg leading-relaxed">
            遇到讓你不舒服的要求，可以拒絕並找信任的大人幫忙。發生任何事，都不是你的錯。
          </p>
          <motion.button
            type="button"
            onClick={() => setScreen("question")}
            className="bg-primary cursor-pointer rounded-full px-10 py-4 text-lg font-bold text-text-main shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            開始任務
          </motion.button>
          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="text-text-light hover:text-text-main mt-6 block min-h-12 w-full cursor-pointer px-6 py-3 text-sm transition-colors"
          >
            回到主選單
          </button>
        </motion.div>
      </div>
    );
  }

  if (screen === "complete") {
    return (
      <div className="flex min-h-dvh flex-col items-center px-6 py-10">
        <div className="w-full max-w-lg">
          <h1 className="mb-3 text-center text-3xl font-bold">任務完成！</h1>
          <p className="text-text-light mb-6 text-center text-base leading-relaxed">
            遇到這些事不是你的錯。請找信任的大人陪你一起求助；不要下載、另存或轉傳私密影像。
          </p>

          <section className="bg-warm-card rounded-2xl p-6 shadow-md" aria-labelledby="help-title">
            <h2 id="help-title" className="mb-4 text-xl font-bold">需要幫忙時</h2>
            <div className="mb-5 rounded-xl bg-warm-bg p-4">
              <p className="mb-2 font-bold">保護與緊急協助</p>
              <p className="text-text-light mb-3 text-sm leading-relaxed">
                113 保護專線 24 小時免付費；有立即危險時，請大人協助聯絡 110。
              </p>
              <div className="flex flex-wrap gap-3">
                <a className="inline-flex min-h-12 min-w-12 items-center text-text-main underline decoration-primary decoration-2" href="tel:113">113 保護專線</a>
                <a className="inline-flex min-h-12 min-w-12 items-center text-text-main underline decoration-primary decoration-2" href="tel:110">110 緊急報案</a>
              </div>
            </div>

            <div className="mb-5 rounded-xl bg-warm-bg p-4">
              <p className="mb-2 font-bold">私密影像被威脅或流傳</p>
              <p className="text-text-light mb-3 text-sm leading-relaxed">
                請信任的大人陪你聯絡性影像處理中心；諮詢電話 02-6605-7373，每日 09:00–22:00。
              </p>
              <a
                className="inline-flex min-h-12 min-w-12 items-center text-text-main underline decoration-primary decoration-2"
                href="https://siarc.mohw.gov.tw/service.php"
                target="_blank"
                rel="noreferrer"
              >
                性影像處理中心資訊（請大人陪同）
              </a>
            </div>

            <div className="rounded-xl bg-warm-bg p-4">
              <p className="mb-2 font-bold">檢舉網路上傷害兒少的內容</p>
              <p className="text-text-light mb-3 text-sm leading-relaxed">
                iWIN 申訴需要聯絡信箱、網址和說明，請信任的大人陪你填寫；不要傳送私密影像。
              </p>
              <a
                className="inline-flex min-h-12 min-w-12 items-center text-text-main underline decoration-primary decoration-2"
                href="https://i.win.org.tw/appeal.php?Target=1"
                target="_blank"
                rel="noreferrer"
              >
                iWIN 網路申訴（請大人陪同）
              </a>
            </div>
          </section>

          <motion.button
            type="button"
            onClick={() => navigate("/menu")}
            className="bg-primary mt-6 w-full cursor-pointer rounded-full px-8 py-4 text-lg font-bold text-text-main shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            回到主選單
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center px-6 py-8">
      <div className="w-full max-w-lg">
        <header className="mb-5 text-center">
          <h1 className="mb-2 text-2xl font-bold">網路安全小任務</h1>
          <p className="text-text-light text-sm">第 {index + 1} / {networkSafetyQuestions.length} 題</p>
        </header>

        <div
          className="bg-warm-bg mb-5 h-2 w-full overflow-hidden rounded-full"
          role="progressbar"
          aria-label="答題進度"
          aria-valuemin={1}
          aria-valuemax={networkSafetyQuestions.length}
          aria-valuenow={index + 1}
        >
          <div
            className="bg-primary h-full rounded-full transition-[width]"
            style={{ width: `${((index + 1) / networkSafetyQuestions.length) * 100}%` }}
          />
        </div>

        <motion.section
          key={current.id}
          className="bg-warm-card rounded-2xl p-6 shadow-md sm:p-8"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          aria-labelledby={`network-question-${current.id}`}
        >
          <h2 id={`network-question-${current.id}`} aria-live="polite" className="mb-6 text-center text-lg font-bold leading-relaxed">
            {current.scenario}
          </h2>

          {answerState !== "unanswered" && (
            <div
              className={`mb-4 rounded-xl p-4 text-center ${answerState === "correct" ? "bg-green-safe-bg" : "bg-red-danger-bg"}`}
              role="status"
              aria-live="polite"
            >
              <p className="mb-1 font-bold">{answerState === "correct" ? "答對了！" : "再想想看喔"}</p>
              <p className="text-text-light text-sm leading-relaxed">{current.explanation}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {current.options.map((option, optionIndex) => {
              const selected = selectedIndex === optionIndex;
              const buttonClass =
                answerState === "unanswered"
                  ? "bg-warm-bg text-text-main hover:bg-primary"
                  : answerState === "wrong" && selected
                    ? "bg-red-danger-bg text-text-main"
                    : answerState === "correct" && optionIndex === current.correctIndex
                      ? "bg-green-safe-bg text-text-main"
                      : "bg-warm-bg text-text-main";
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleAnswer(optionIndex)}
                  disabled={answerState === "correct"}
                  className={`w-full cursor-pointer rounded-xl px-4 py-4 text-left text-base font-bold transition-colors ${buttonClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {answerState === "wrong" && (
            <button
              type="button"
              onClick={handleRetry}
              className="bg-primary mt-4 w-full cursor-pointer rounded-full py-3 font-bold text-text-main"
            >
              再試一次
            </button>
          )}
          {answerState === "correct" && (
            <button
              type="button"
              onClick={handleNext}
              className="bg-primary mt-4 w-full cursor-pointer rounded-full py-3 font-bold text-text-main"
            >
              {index + 1 === networkSafetyQuestions.length ? "完成任務" : "下一題"}
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="text-text-light hover:text-text-main mt-4 min-h-12 w-full cursor-pointer py-3 text-sm transition-colors"
          >
            回到主選單
          </button>
        </motion.section>
      </div>
    </div>
  );
}
