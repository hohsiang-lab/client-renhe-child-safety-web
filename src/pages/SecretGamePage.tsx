import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { secretQuestions } from "../data/secrets";
import type { SecretQuestion } from "../data/secrets";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { SecretCard } from "../components/SecretCard";

type Phase = "intro" | "grid" | "trusted-adults";

const trustedAdultCards = [
  { name: "媽媽", src: "/images/trusted-adults/mom.png" },
  { name: "爸爸", src: "/images/trusted-adults/dad.png" },
  { name: "奶奶", src: "/images/trusted-adults/grandma.png" },
  { name: "老師", src: "/images/trusted-adults/teacher.png" },
  { name: "警察", src: "/images/trusted-adults/police.png" },
  { name: "親戚", src: "/images/trusted-adults/relatives.png" },
  { name: "隔壁叔叔阿姨", src: "/images/trusted-adults/neighbors.png" },
  { name: "媽媽的男朋友", src: "/images/trusted-adults/moms-boyfriend.png" },
];

export default function SecretGamePage() {
  const navigate = useNavigate();
  const { stop } = useAudioPlayer();

  const [phase, setPhase] = useState<Phase>("intro");
  const [viewedIds, setViewedIds] = useState<Set<number>>(new Set());
  const [selectedCard, setSelectedCard] = useState<SecretQuestion | null>(null);
  const [modalBackError, setModalBackError] = useState(false);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  function handleCardSelect(q: SecretQuestion) {
    setModalBackError(false);
    setSelectedCard(q);
    setViewedIds((prev) => new Set(prev).add(q.id));
  }

  function closeModal() {
    setSelectedCard(null);
  }

  function openTrustedAdults() {
    stop();
    setSelectedCard(null);
    setPhase("trusted-adults");
  }

  const allViewed = viewedIds.size === secretQuestions.length;

  if (phase === "intro") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
        <motion.h1
          className="mb-2 text-3xl font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          秘密遊戲 🔑
        </motion.h1>
        <motion.p
          className="text-text-light mb-10 text-center text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          你知道什麼是好秘密、什麼是壞秘密嗎？
        </motion.p>

        <div className="grid w-full max-w-md grid-cols-2 gap-4">
          <motion.button
            onClick={() => setPhase("grid")}
            className="bg-green-safe-bg flex cursor-pointer flex-col items-center rounded-2xl p-8 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="mb-3 text-5xl">⭕</span>
            <h2 className="mb-1 text-xl font-bold">好秘密</h2>
            <p className="text-text-light text-center text-xs leading-relaxed">
              讓人開心<br />不會讓你害怕
            </p>
          </motion.button>

          <motion.button
            onClick={() => setPhase("grid")}
            className="bg-red-danger-bg flex cursor-pointer flex-col items-center rounded-2xl p-8 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="mb-3 text-5xl">❌</span>
            <h2 className="mb-1 text-xl font-bold">壞秘密</h2>
            <p className="text-text-light text-center text-xs leading-relaxed">
              讓你不舒服<br />或感到害怕
            </p>
          </motion.button>
        </div>

        <motion.button
          onClick={() => navigate("/menu")}
          className="text-text-light hover:text-primary mt-10 cursor-pointer px-6 py-3 text-sm transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          ← 回到選單
        </motion.button>
      </div>
    );
  }

  if (phase === "grid") {
    return (
      <div className="flex min-h-dvh flex-col px-4 py-8">
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="mb-1 text-2xl font-bold">秘密卡片 🔒</h1>
          <p className="text-text-light text-sm">
            點擊每張卡片翻面看看 👇
          </p>
        </motion.div>

        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-4 gap-4">
          {secretQuestions.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
            >
              <SecretCard
                question={q}
                viewed={viewedIds.has(q.id)}
                onSelect={handleCardSelect}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          {allViewed && (
            <motion.button
              onClick={() => navigate("/ending")}
              className="bg-primary hover:bg-primary-hover cursor-pointer rounded-full px-10 py-3 font-bold text-white shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              data-testid="complete-button"
            >
              完成遊戲 🎉
            </motion.button>
          )}
          <motion.button
            onClick={() => setPhase("intro")}
            className="text-text-light hover:text-primary cursor-pointer px-6 py-2 text-sm transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            ← 返回
          </motion.button>
        </div>

        {/* Card Modal */}
        {selectedCard && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -right-3 -top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-gray-600 shadow-lg hover:bg-gray-100"
                onClick={closeModal}
                data-testid="card-modal-close"
              >
                ✕
              </button>

              <div
                className="overflow-hidden rounded-2xl shadow-2xl"
                style={{ width: "min(360px, calc(100vw - 3rem))", aspectRatio: "1414 / 2000" }}
                data-testid={`card-back-${selectedCard.id}`}
              >
                {modalBackError ? (
                  <div
                    className={`flex h-full w-full flex-col items-center justify-center p-6 text-center ${
                      selectedCard.answer === "bad" ? "bg-red-danger-bg" : "bg-green-safe-bg"
                    }`}
                  >
                    <p className={`mb-2 text-base font-bold ${selectedCard.answer === "bad" ? "text-red-danger" : "text-green-safe"}`}>
                      {selectedCard.answer === "bad" ? "❌ 壞秘密" : "⭕ 好秘密"}
                    </p>
                    <p className="text-sm leading-relaxed">{selectedCard.explanation}</p>
                  </div>
                ) : (
                  <img
                    src={selectedCard.backImage}
                    alt={selectedCard.explanation}
                    className="h-full w-full object-cover"
                    onError={() => setModalBackError(true)}
                  />
                )}
              </div>

              {selectedCard.answer === "bad" && (
                <button
                  className="bg-primary hover:bg-primary-hover mt-4 cursor-pointer rounded-full py-3 font-bold text-white shadow-md"
                  style={{ width: "min(360px, calc(100vw - 3rem))" }}
                  onClick={openTrustedAdults}
                  data-testid={`trusted-adults-cta-${selectedCard.id}`}
                >
                  誰是信任的大人？
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  }

  if (phase === "trusted-adults") {
    return (
      <motion.div
        className="flex min-h-dvh flex-col"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between px-6 py-4 shadow-sm">
          <h2 className="text-xl font-bold">信任的大人 💛</h2>
          <motion.button
            onClick={() => setPhase("grid")}
            className="bg-primary hover:bg-primary-hover cursor-pointer rounded-full px-6 py-2 font-bold text-white"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            我知道了
          </motion.button>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-4 overflow-y-auto p-4 sm:grid-cols-3">
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
              <p className="mt-2 text-sm font-medium">{card.name}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 text-base">頁面狀態異常，請回到選單。</p>
      <button
        onClick={() => navigate("/menu")}
        className="bg-primary hover:bg-primary-hover cursor-pointer rounded-full px-6 py-3 font-bold text-white"
      >
        ← 回到選單
      </button>
    </div>
  );
}
