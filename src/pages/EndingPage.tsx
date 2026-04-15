import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

const STARS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 2,
  duration: 2.5 + Math.random() * 2,
  size: 16 + Math.random() * 20,
}));

const HELP_RESOURCES = [
  {
    phone: "113",
    name: "保護專線",
    desc: "24 小時免費，有人會幫助你",
    color: "bg-red-danger-bg",
    border: "border-red-danger",
    icon: "🛡️",
  },
  {
    phone: "110",
    name: "報案專線",
    desc: "遇到危險可以打這支電話",
    color: "bg-red-danger-bg",
    border: "border-red-danger",
    icon: "🚔",
  },
  {
    phone: "1925",
    name: "安心專線",
    desc: "心裡不舒服可以打來聊聊",
    color: "bg-green-safe-bg",
    border: "border-green-safe",
    icon: "💙",
  },
  {
    phone: "iWIN",
    name: "網路內容防護機構",
    desc: "網路上的不安全可以向這裡求助",
    color: "bg-green-safe-bg",
    border: "border-green-safe",
    icon: "🌐",
  },
];

export default function EndingPage() {
  const navigate = useNavigate();
  const { play } = useAudioPlayer();

  useEffect(() => {
    play("/audio/ending.mp3");
  }, [play]);

  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* 撒花動畫 */}
      {STARS.map((star) => (
        <motion.div
          key={star.id}
          className="pointer-events-none absolute select-none"
          style={{ left: `${star.x}%`, top: "-40px", fontSize: star.size }}
          initial={{ y: -40, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: [1, 1, 0], rotate: 360 }}
          transition={{
            delay: star.delay,
            duration: star.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {star.id % 3 === 0 ? "⭐" : star.id % 3 === 1 ? "🌟" : "✨"}
        </motion.div>
      ))}

      <motion.div
        className="relative z-10 flex min-h-dvh flex-col items-center px-6 py-10 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* 角色 */}
        <motion.div
          className="mb-4 flex gap-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.span
            className="text-7xl"
            animate={{ rotate: [0, 15, -5, 15, 0] }}
            transition={{ delay: 0.8, duration: 0.8, repeat: 3 }}
          >
            👦
          </motion.span>
          <motion.span
            className="text-7xl"
            animate={{ rotate: [0, -15, 5, -15, 0] }}
            transition={{ delay: 1.0, duration: 0.8, repeat: 3 }}
          >
            👧
          </motion.span>
        </motion.div>

        {/* 鼓勵文字 */}
        <motion.h1
          className="mb-3 text-4xl font-bold md:text-5xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          你好棒！🎉
        </motion.h1>
        <motion.p
          className="text-text-light mb-8 max-w-md text-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          今天學到了很多保護自己的方法！
        </motion.p>

        {/* 求助資訊卡 */}
        <motion.div
          className="mb-8 w-full max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="mb-4 text-2xl font-bold">需要幫助嗎？</h2>
          <div className="space-y-3">
            {HELP_RESOURCES.map((r) => (
              <div
                key={r.phone}
                className={`flex items-center gap-4 rounded-2xl border-2 ${r.color} ${r.border} p-4 text-left`}
              >
                <span className="text-3xl">{r.icon}</span>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{r.phone}</span>
                    <span className="font-semibold">{r.name}</span>
                  </div>
                  <p className="text-text-light mt-0.5 text-sm">{r.desc}</p>
                </div>
              </div>
            ))}
            {/* 當地社福單位（客戶提供） */}
            <div className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-current p-4 text-left opacity-60">
              <span className="text-3xl">🏠</span>
              <div>
                <div className="font-semibold">當地社福單位</div>
                <p className="text-text-light mt-0.5 text-sm">（由仁和社區提供聯絡資訊）</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 按鈕 */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.button
            onClick={() => navigate("/menu")}
            className="bg-primary hover:bg-primary-hover cursor-pointer rounded-full px-10 py-4 text-xl font-bold text-white shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            回去再玩一次 🎮
          </motion.button>
          <motion.button
            onClick={() => navigate("/")}
            className="cursor-pointer rounded-full border-2 border-current px-10 py-4 text-xl font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            回到首頁
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
