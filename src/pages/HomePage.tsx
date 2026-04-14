import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="mb-4 text-4xl font-bold md:text-5xl">
        保護自己大冒險
      </h1>
      <p className="text-text-light mb-10 text-lg">
        一起來學習怎麼保護自己吧！
      </p>

      {/* TODO: HO-601 角色圖片 */}
      <div className="bg-warm-card mb-10 flex h-48 w-64 items-center justify-center rounded-2xl">
        <span className="text-text-light text-sm">角色圖片區域</span>
      </div>

      <button
        onClick={() => navigate("/menu")}
        className="bg-primary hover:bg-primary-hover cursor-pointer rounded-full px-10 py-4 text-xl font-bold text-white shadow-lg transition-transform hover:scale-105"
      >
        開始探險
      </button>
    </motion.div>
  );
}
