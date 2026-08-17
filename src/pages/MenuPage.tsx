import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const modules = [
  {
    name: "秘密遊戲",
    description: "學習分辨好秘密和壞秘密",
    path: "/secret-game",
    emoji: "🔑",
    age: "適合 5–12 歲",
  },
  {
    name: "身體紅綠燈",
    description: "認識身體的安全界線",
    path: "/body-traffic-light",
    emoji: "🚦",
    age: "適合 5–12 歲",
  },
  {
    name: "信任的大人",
    description: "找到可以求助的大人",
    path: "/trusted-adult",
    emoji: "♥",
    age: "適合 5–12 歲",
  },
  {
    name: "網路安全",
    description: "學會保護自己的網路界線",
    path: "/network-safety",
    emoji: "◎",
    age: "適合 8–12 歲",
  },
];

export default function MenuPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <motion.h1
        className="mb-10 text-3xl font-bold md:text-4xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        選擇你想玩的遊戲
      </motion.h1>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
        {modules.map((mod, i) => (
          <motion.button
            key={mod.path}
            onClick={() => navigate(mod.path)}
            className="bg-warm-card flex cursor-pointer flex-col items-center rounded-2xl p-8 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="module-icon" aria-hidden="true">{mod.emoji}</span>
            <h2 className="mb-2 text-xl font-bold">{mod.name}</h2>
            <p className="text-text-light text-sm">{mod.description}</p>
            <span className="mt-3 text-xs text-text-light">{mod.age}</span>
          </motion.button>
        ))}
      </div>

      <motion.button
        onClick={() => navigate("/")}
        className="text-text-light hover:text-primary mt-10 cursor-pointer px-6 py-3 text-sm transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        ← 回到首頁
      </motion.button>
    </div>
  );
}
