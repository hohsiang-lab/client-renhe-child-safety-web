import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const modules = [
  {
    name: "秘密遊戲",
    description: "學習分辨好秘密和壞秘密",
    path: "/secret-game",
    emoji: "🔑",
  },
  {
    name: "身體紅綠燈",
    description: "認識身體的安全界線",
    path: "/body-traffic-light",
    emoji: "🚦",
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
            <span className="mb-3 text-5xl">{mod.emoji}</span>
            <h2 className="mb-2 text-xl font-bold">{mod.name}</h2>
            <p className="text-text-light text-sm">{mod.description}</p>
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
