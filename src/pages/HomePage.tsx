import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAudioContext } from "../hooks/useAudioContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { isMuted, currentAudioRef } = useAudioContext();

  function handleStart() {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    const audio = new Audio("/audio/home-welcome.mp3");
    audio.muted = isMuted;
    currentAudioRef.current = audio;
    const clearRef = () => {
      if (currentAudioRef.current === audio) {
        currentAudioRef.current = null;
      }
    };
    audio.onended = clearRef;
    audio.onerror = clearRef;
    audio.play().catch(clearRef);

    navigate("/menu");
  }

  return (
    <motion.div
      className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="mx-auto mb-2 text-6xl">🌟</div>
      </motion.div>

      <h1 className="mb-3 text-4xl font-bold md:text-5xl">保護自己大冒險</h1>
      <p className="text-text-light mb-8 text-lg md:text-xl">
        一起來學習怎麼保護自己吧！
      </p>

      <motion.div
        className="bg-warm-card mb-8 flex items-center justify-center gap-6 rounded-3xl px-10 py-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <span className="text-5xl">👦</span>
        <span className="text-5xl">👧</span>
      </motion.div>

      <motion.button
        onClick={handleStart}
        className="bg-primary hover:bg-primary-hover cursor-pointer rounded-full px-10 py-4 text-xl font-bold text-white shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        開始探險 🚀
      </motion.button>
    </motion.div>
  );
}
