import { useState } from "react";
import type { SecretQuestion } from "../data/secrets";

interface Props {
  question: SecretQuestion;
  viewed: boolean;
  onSelect: (question: SecretQuestion) => void;
}

export function SecretCard({ question, viewed, onSelect }: Props) {
  const [frontError, setFrontError] = useState(false);
  const isBad = question.answer === "bad";

  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-xl"
      style={{ aspectRatio: "1414 / 2000" }}
      onClick={() => onSelect(question)}
      data-testid={`card-front-${question.id}`}
    >
      {frontError ? (
        <div
          className={`flex h-full w-full flex-col items-center justify-center p-4 text-center ${
            isBad ? "bg-red-danger-bg" : "bg-green-safe-bg"
          }`}
        >
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
  );
}
