import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BODY_TRAFFIC_LIGHTS } from "../data/bodyTrafficLights";
import { networkSafetyQuestions } from "../data/networkSafety";
import { secretQuestions } from "../data/secrets";
import { trustedAdultCards, trustQuestions } from "../data/trustedAdult";

type GuideSlide = {
  id: string;
  title: string;
  prompt: string;
  options?: string[];
  adultOptions?: typeof trustedAdultCards;
  answer?: string;
  keyPoint?: string;
  image?: string;
  openEnded?: boolean;
};

type GuideModule = {
  id: string;
  name: string;
  slides: GuideSlide[];
};

const guideModules: GuideModule[] = [
  {
    id: "secret-game",
    name: "秘密遊戲",
    slides: secretQuestions.map((question) => ({
      id: `secret-${question.id}`,
      title: `第 ${question.id} 題`,
      prompt: question.scenario,
      options: ["⭕ 好秘密", "❌ 壞秘密"],
      answer: question.answer === "bad" ? "❌ 壞秘密" : "⭕ 好秘密",
      keyPoint: question.explanation,
      image: question.frontImage,
    })),
  },
  {
    id: "body-traffic-light",
    name: "身體紅綠燈",
    slides: BODY_TRAFFIC_LIGHTS.map((light, index) => ({
      id: light.id,
      title: `重點 ${index + 1}：${light.label}`,
      prompt: light.text,
      keyPoint: light.text,
    })),
  },
  {
    id: "trusted-adult",
    name: "信任大人",
    slides: trustQuestions.map((question) => {
      if (question.roleSelection) {
        return {
          id: `trust-${question.id}`,
          title: `第 ${question.id} 題`,
          prompt: question.scenario,
          adultOptions: trustedAdultCards,
          openEnded: true,
          keyPoint: question.explanation,
        };
      }
      return {
        id: `trust-${question.id}`,
        title: `第 ${question.id} 題`,
        prompt: question.scenario,
        options: question.options,
        answer: question.options[question.correctIndex],
        keyPoint: question.explanation,
      };
    }),
  },
  {
    id: "network-safety",
    name: "網路安全",
    slides: networkSafetyQuestions.map((question) => ({
      id: `network-${question.id}`,
      title: `第 ${question.id} 題`,
      prompt: question.scenario,
      options: question.options,
      answer: question.options[question.correctIndex],
      keyPoint: question.explanation,
    })),
  },
];

export default function FacilitatorModePage() {
  const navigate = useNavigate();
  const presentationRef = useRef<HTMLElement>(null);
  const [moduleId, setModuleId] = useState(guideModules[0].id);
  const [slideIndex, setSlideIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [enlarged, setEnlarged] = useState(false);
  const [cssPresentation, setCssPresentation] = useState(false);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const activeModule = guideModules.find((module) => module.id === moduleId) ?? guideModules[0];
  const slide = activeModule.slides[slideIndex];
  const fullscreenSupported =
    document.fullscreenEnabled && typeof HTMLElement.prototype.requestFullscreen === "function";
  const isPresentation = cssPresentation || nativeFullscreen;

  useEffect(() => {
    const syncFullscreen = () => {
      setNativeFullscreen(document.fullscreenElement === presentationRef.current);
    };
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  function changeModule(nextModuleId: string) {
    setModuleId(nextModuleId);
    setSlideIndex(0);
    setShowAnswer(false);
  }

  function changeSlide(nextSlideIndex: number) {
    setSlideIndex(nextSlideIndex);
    setShowAnswer(false);
  }

  function restartModule() {
    setSlideIndex(0);
    setShowAnswer(false);
  }

  async function togglePresentation() {
    if (cssPresentation) {
      setCssPresentation(false);
      return;
    }
    if (document.fullscreenElement === presentationRef.current) {
      await document.exitFullscreen().catch(() => undefined);
      return;
    }
    const element = presentationRef.current;
    if (fullscreenSupported && element) {
      try {
        await element.requestFullscreen();
        return;
      } catch {
        setCssPresentation(true);
        return;
      }
    }
    setCssPresentation(true);
  }

  function returnToMenu() {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    setCssPresentation(false);
    navigate("/menu");
  }

  return (
    <main
      ref={presentationRef}
      className={[
        isPresentation
          ? "fixed inset-0 z-50 overflow-y-auto bg-warm-bg px-3 py-3 text-text-main sm:px-4 sm:py-3"
          : "min-h-dvh bg-warm-bg px-4 py-5 text-text-main sm:px-6 sm:py-8",
      ].join(" ")}
    >
      <div
        className={`mx-auto flex w-full max-w-5xl flex-col ${
          isPresentation ? "min-h-full" : "min-h-[calc(100dvh-2.5rem)]"
        }`}
      >
        <header
          className={`rounded-2xl bg-white/90 shadow-sm ${
            isPresentation ? "mb-2 p-3" : "mb-6 p-4 sm:p-5"
          }`}
        >
          <div className={`flex flex-wrap items-center justify-between ${isPresentation ? "mb-2 gap-2" : "mb-4 gap-3"}`}>
            <h1 className="text-2xl font-bold sm:text-3xl">宣導帶領模式</h1>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={returnToMenu}
                className="min-h-12 rounded-xl border border-warm-border bg-white px-4 py-2 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                ← 回主選單
              </button>
              <button
                type="button"
                onClick={() => void togglePresentation()}
                aria-pressed={isPresentation}
                className="min-h-12 rounded-xl bg-primary px-4 py-2 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {isPresentation
                  ? "退出投影模式"
                  : fullscreenSupported
                    ? "進入全螢幕"
                    : "開啟投影模式"}
              </button>
              <button
                type="button"
                onClick={() => setEnlarged((value) => !value)}
                aria-pressed={enlarged}
                className="min-h-12 rounded-xl border border-warm-border bg-white px-4 py-2 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {enlarged ? "縮小文字" : "放大文字"}
              </button>
              <button
                type="button"
                onClick={restartModule}
                className="min-h-12 rounded-xl border border-warm-border bg-white px-4 py-2 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                重新開始本單元
              </button>
            </div>
          </div>

          {cssPresentation && (
            <p role="status" className="mb-2 rounded-xl bg-warm-card px-3 py-2 text-sm">
              瀏覽器無法切換全螢幕，已開啟投影顯示模式。
            </p>
          )}

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex flex-col gap-1 font-semibold" htmlFor="facilitator-module">
              選擇單元
              <select
                id="facilitator-module"
                value={activeModule.id}
                onChange={(event) => changeModule(event.target.value)}
                className="min-h-12 rounded-xl border border-warm-border bg-white px-3 py-2 font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {guideModules.map((module) => (
                  <option key={module.id} value={module.id}>{module.name}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 font-semibold" htmlFor="facilitator-question">
              直接選擇題目／重點
              <select
                id="facilitator-question"
                value={slideIndex}
                onChange={(event) => changeSlide(Number(event.target.value))}
                className="min-h-12 rounded-xl border border-warm-border bg-white px-3 py-2 font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {activeModule.slides.map((item, index) => (
                  <option key={item.id} value={index}>
                    {activeModule.id === "body-traffic-light" ? item.title : `第 ${index + 1} 題`}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        <section
          aria-labelledby="facilitator-slide-title"
          className={`flex flex-1 flex-col rounded-3xl bg-white shadow-md ${
            isPresentation ? "min-h-0 p-3 sm:p-4" : "p-5 sm:p-8"
          }`}
        >
          <div className={`flex flex-wrap items-center justify-between gap-2 ${isPresentation ? "mb-3" : "mb-5"}`}>
            <p className="text-text-light font-semibold">{activeModule.name}</p>
            <p className="text-text-light text-sm">{slideIndex + 1} / {activeModule.slides.length}</p>
          </div>
          <h2 id="facilitator-slide-title" className={`text-xl font-bold sm:text-2xl ${isPresentation ? "mb-2" : "mb-4"}`}>
            {slide.title}
          </h2>
          <p className={`text-center font-bold leading-relaxed ${isPresentation ? "mb-3" : "mb-5"} ${enlarged ? "text-2xl sm:text-4xl" : "text-xl sm:text-3xl"}`}>
            {slide.prompt}
          </p>

          {slide.image && (
            <img
              src={slide.image}
              alt={slide.prompt}
              className={`mx-auto max-w-full rounded-xl object-contain ${
                isPresentation ? "mb-3 max-h-[16vh]" : "mb-5 max-h-[34vh]"
              }`}
            />
          )}

          {slide.adultOptions && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {slide.adultOptions.map((adult) => (
                <div key={adult.name} className={`flex flex-col items-center rounded-2xl bg-warm-card ${isPresentation ? "p-2" : "p-3"} text-center font-bold`}>
                  <img
                    src={adult.src}
                    alt=""
                    className={`mb-2 h-28 w-full object-contain sm:h-36 ${isPresentation ? "max-h-[14vh]" : ""}`}
                  />
                  {adult.name}
                </div>
              ))}
            </div>
          )}

          {slide.options && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {slide.options.map((option) => (
                <li key={option} className={`flex min-h-14 items-center rounded-2xl bg-warm-card px-4 py-3 font-semibold leading-relaxed ${enlarged ? "text-xl sm:text-2xl" : "text-base sm:text-lg"}`}>
                  {option}
                </li>
              ))}
            </ul>
          )}

          {showAnswer && (
            <div
              role="status"
              aria-live="polite"
              className={`rounded-2xl bg-green-safe-bg ${isPresentation ? "mt-2 p-2" : "mt-5 p-5"}`}
            >
              {slide.answer && (
                <p className={`mb-2 font-bold text-green-safe-dark ${enlarged ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}>
                  參考答案：{slide.answer}
                </p>
              )}
              {slide.openEnded && (
                <p className="mb-2 font-bold text-green-safe-dark">這題是開放選擇。</p>
              )}
              {slide.keyPoint && (
                <p className={`leading-relaxed ${enlarged ? "text-lg sm:text-xl" : "text-base sm:text-lg"}`}>
                  重點：{slide.keyPoint}
                </p>
              )}
            </div>
          )}

          <div className={`mt-auto flex flex-wrap justify-center gap-3 ${isPresentation ? "pt-2" : "pt-6"}`}>
            <button
              type="button"
              onClick={() => changeSlide(Math.max(0, slideIndex - 1))}
              disabled={slideIndex === 0}
              className={`min-w-32 rounded-full border border-warm-border font-bold disabled:cursor-not-allowed disabled:opacity-50 ${
                isPresentation ? "min-h-11 px-5 py-2" : "min-h-12 px-5 py-3"
              }`}
            >
              上一題／重點
            </button>
            <button
              type="button"
              onClick={() => setShowAnswer((value) => !value)}
              aria-pressed={showAnswer}
              className={`rounded-full bg-green-safe-dark font-bold text-white ${
                isPresentation ? "min-h-11 px-6 py-2" : "min-h-12 px-6 py-3"
              }`}
            >
              {showAnswer ? "隱藏答案與重點" : "顯示答案與重點"}
            </button>
            <button
              type="button"
              onClick={() => changeSlide(Math.min(activeModule.slides.length - 1, slideIndex + 1))}
              disabled={slideIndex === activeModule.slides.length - 1}
              className={`min-w-32 rounded-full bg-primary font-bold disabled:cursor-not-allowed disabled:opacity-50 ${
                isPresentation ? "min-h-11 px-5 py-2" : "min-h-12 px-5 py-3"
              }`}
            >
              下一題／重點
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
