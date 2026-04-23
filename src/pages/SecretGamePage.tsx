import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { secretQuestions, type SecretQuestion } from "../data/secrets";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

type Phase = "select-type" | "card-grid" | "card-detail" | "trusted-adults";

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
  const { play, stop } = useAudioPlayer();

  const [phase, setPhase] = useState<Phase>("select-type");
  const [selectedCard, setSelectedCard] = useState<SecretQuestion | null>(null);
  const [selectedType, setSelectedType] = useState<"good" | "bad" | null>(null);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  function openCard(q: SecretQuestion) {
    stop();
    setSelectedCard(q);
    setPhase("card-detail");
    play(`/audio/secret-q${q.id}-scenario.mp3`);
  }

  function closeCardToGrid() {
    stop();
    setSelectedCard(null);
    setPhase("card-grid");
  }

  if (phase === "select-type") {
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
            onClick={() => { setSelectedType("good"); setPhase("card-grid"); }}
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
            onClick={() => { setSelectedType("bad"); setPhase("card-grid"); }}
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

  if (phase === "card-grid") {
    return (
      <div className="flex min-h-dvh flex-col px-4 py-8">
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="mb-1 text-2xl font-bold">秘密卡片 🔒</h1>
          <p className="text-text-light text-sm">
            {selectedType === "good" ? "你選了好秘密！" : "你選了壞秘密！"}
            來點開每張卡片看看 👇
          </p>
        </motion.div>

        <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
          {secretQuestions.map((q, i) => (
            <motion.button
              key={q.id}
              onClick={() => openCard(q)}
              className="bg-warm-card flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl p-4 shadow-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mb-2 text-4xl">🤫</span>
              <span className="text-text-light text-xs font-medium">秘密 #{q.id}</span>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <motion.button
            onClick={() => navigate("/ending")}
            className="bg-primary hover:bg-primary-hover cursor-pointer rounded-full px-10 py-3 font-bold text-white shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            完成遊戲 🎉
          </motion.button>
          <motion.button
            onClick={() => setPhase("select-type")}
            className="text-text-light hover:text-primary cursor-pointer px-6 py-2 text-sm transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            ← 返回
          </motion.button>
        </div>
      </div>
    );
  }

  if (phase === "card-detail" && selectedCard) {
    const isBad = selectedCard.answer === "bad";
    return (
      <motion.div
        className="flex min-h-dvh flex-col"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between px-6 py-4 shadow-sm">
          <h2 className="text-xl font-bold">秘密 #{selectedCard.id}</h2>
          <motion.button
            onClick={closeCardToGrid}
            className="text-text-light hover:text-primary cursor-pointer rounded-full p-2 text-xl transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            ✕
          </motion.button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-8 py-6 text-center">
          <motion.div
            className="mb-6 text-6xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
          >
            🤫
          </motion.div>

          <motion.p
            className="mb-8 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {selectedCard.scenario}
          </motion.p>

          <motion.div
            className={`mb-4 w-full max-w-sm rounded-2xl p-4 ${isBad ? "bg-red-danger-bg" : "bg-green-safe-bg"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className={`mb-1 text-lg font-bold ${isBad ? "text-red-danger" : "text-green-safe"}`}>
              {isBad ? "❌ 壞秘密" : "⭕ 好秘密"}
            </p>
            <p className="text-text-light text-sm leading-relaxed">
              {selectedCard.explanation}
            </p>
          </motion.div>

          {isBad ? (
            <motion.button
              onClick={() => setPhase("trusted-adults")}
              className="bg-primary hover:bg-primary-hover mt-4 w-full max-w-sm cursor-pointer rounded-full py-4 font-bold text-white shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              那哪些是信任的大人呢？
            </motion.button>
          ) : (
            <motion.button
              onClick={closeCardToGrid}
              className="bg-primary hover:bg-primary-hover mt-4 w-full max-w-sm cursor-pointer rounded-full py-4 font-bold text-white shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              我知道了！
            </motion.button>
          )}
        </div>
      </motion.div>
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
            onClick={closeCardToGrid}
            className="bg-primary hover:bg-primary-hover cursor-pointer rounded-full px-6 py-2 font-bold text-white"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            我知道了
          </motion.button>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-4 overflow-y-auto p-4 sm:grid-cols-3">
          {trustedAdultCards.map((card) => (
            <div key={card.name} className="flex flex-col items-center">
              <img
                src={card.src}
                alt={card.name}
                className="w-full rounded-2xl object-contain"
              />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return null;
}
