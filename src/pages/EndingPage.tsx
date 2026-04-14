import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function EndingPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="mb-4 text-3xl font-bold md:text-4xl">
        你好棒！
      </h1>
      <p className="text-text-light mb-10 text-lg">
        今天學到了很多保護自己的方法！
      </p>

      {/* TODO: HO-611 求助資訊卡 */}
      <div className="bg-warm-card mb-10 w-full max-w-md rounded-2xl p-6 text-left">
        <h2 className="mb-4 text-xl font-bold">需要幫助嗎？</h2>
        <ul className="space-y-3 text-base">
          <li>📞 <strong>113</strong> — 保護專線（24 小時）</li>
          <li>📞 <strong>110</strong> — 報案專線</li>
          <li>📞 <strong>1925</strong> — 安心專線</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/menu")}
          className="bg-primary hover:bg-primary-hover cursor-pointer rounded-full px-8 py-3 font-bold text-white"
        >
          再玩一次
        </button>
        <button
          onClick={() => navigate("/")}
          className="cursor-pointer rounded-full border-2 border-current px-8 py-3 font-bold"
        >
          回到首頁
        </button>
      </div>
    </motion.div>
  );
}
