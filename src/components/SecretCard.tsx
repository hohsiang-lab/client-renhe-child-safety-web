import { useState } from "react";
import type { SecretQuestion } from "../data/secrets";

interface Props {
  question: SecretQuestion;
  viewed: boolean;
  onFlipped: (id: number) => void;
  onTrustedAdults: () => void;
}

export function SecretCard({ question, viewed, onFlipped, onTrustedAdults }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [frontError, setFrontError] = useState(false);
  const [backError, setBackError] = useState(false);
  const isBad = question.answer === "bad";

  function handleFrontClick() {
    setFlipped(true);
    onFlipped(question.id);
  }

  return (
    <div className="relative" style={{ perspective: "1000px" }}>
      <div
        className="relative w-full"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 350ms ease-in-out",
          aspectRatio: "1414 / 2000",
        }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 cursor-pointer overflow-hidden rounded-xl ${
            frontError ? (isBad ? "bg-red-danger-bg" : "bg-green-safe-bg") : ""
          }`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          onClick={handleFrontClick}
          data-testid={`card-front-${question.id}`}
        >
          {frontError ? (
            <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
              <span className="mb-3 text-5xl">{isBad ? "❌" : "⭕"}</span>
              <p className="text-sm leading-relaxed">{question.scenario}</p>
            </div>
          ) : (
            <img
              src={question.frontImage}
              alt={question.scenario}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={() => setFrontError(true)}
            />
          )}
          {viewed && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40"
              data-testid={`card-viewed-overlay-${question.id}`}
            >
              <span className="text-4xl">✅</span>
            </div>
          )}
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 overflow-hidden rounded-xl ${
            backError ? (isBad ? "bg-red-danger-bg" : "bg-green-safe-bg") : ""
          }`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          onClick={() => setFlipped(false)}
          data-testid={`card-back-${question.id}`}
        >
          {backError ? (
            <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
              <p className={`mb-2 text-base font-bold ${isBad ? "text-red-danger" : "text-green-safe"}`}>
                {isBad ? "❌ 壞秘密" : "⭕ 好秘密"}
              </p>
              <p className="text-sm leading-relaxed">{question.explanation}</p>
            </div>
          ) : (
            <img
              src={question.backImage}
              alt={question.explanation}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={() => setBackError(true)}
            />
          )}
          {isBad && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center px-3">
              <button
                className="bg-primary hover:bg-primary-hover w-full cursor-pointer rounded-full py-2 text-xs font-bold text-white shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrustedAdults();
                }}
                data-testid={`trusted-adults-cta-${question.id}`}
              >
                誰是信任的大人？
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
