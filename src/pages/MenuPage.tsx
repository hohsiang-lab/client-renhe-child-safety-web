import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAudioContext } from "../hooks/useAudioContext";
import { AudioCaption } from "../components/AudioCaption";

const modules = [
  {
    name: "秘密遊戲",
    description: "學習分辨好秘密和壞秘密",
    path: "/secret-game",
    image: "/images/secrets/q1-front.png",
    imageAlt: "秘密遊戲教材卡：孩子製作生日驚喜卡",
  },
  {
    name: "身體紅綠燈",
    description: "認識身體的安全界線",
    path: "/body-traffic-light",
    image: "/images/紅綠燈女.png",
    imageAlt: "身體紅綠燈教材插畫",
  },
  {
    name: "信任大人",
    description: "認識可能協助你的大人",
    path: "/trusted-adult",
    image: "/images/trusted-adults/grandma.png",
    imageAlt: "信任大人奶奶教材插畫",
  },
  {
    name: "網路安全",
    description: "認識網路誘惑，學會安全求助",
    path: "/network-safety",
    image: "/images/network-safety/五不.png",
    imageAlt: "數位性暴力防治「五不」宣導教材原圖",
  },
];

export default function MenuPage() {
  const navigate = useNavigate();
  const { currentAudioRef, currentCaption, setCurrentCaption } = useAudioContext();

  useEffect(() => () => {
    const audio = currentAudioRef.current;
    if (!audio?.src.endsWith("/audio/home-welcome.mp3")) return;
    audio.pause();
    currentAudioRef.current = null;
    setCurrentCaption(null);
  }, [currentAudioRef, setCurrentCaption]);

  return (
    <div className="menu-page flex min-h-dvh flex-col items-center justify-start px-3 pb-8 md:px-0">
      <motion.h1
        className="menu-page__title w-full max-w-[1160px] font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        選擇主題
      </motion.h1>

      {currentCaption ? (
        <AudioCaption inline />
      ) : (
        <p className="menu-page__subtitle w-full max-w-[1160px]">
          一起來學習怎麼保護自己吧！
        </p>
      )}

      <div className="menu-page__grid w-full max-w-[1160px]">
        {modules.map((mod, i) => {
          const titleId = `menu-module-title-${i}`;
          const descriptionId = `menu-module-description-${i}`;

          return (
            <motion.div
              key={mod.path}
              className="paper-card menu-module bg-warm-card flex items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.03 }}
            >
              <img className="menu-module__art" src={mod.image} alt={mod.imageAlt} />
              <div className="menu-module__copy min-w-0">
                <h2 id={titleId} className="menu-module__title">{mod.name}</h2>
                <p id={descriptionId} className="menu-module__description">{mod.description}</p>
                <span aria-hidden="true" className="menu-module__rule" />
              </div>
              <button
                type="button"
                aria-labelledby={`${titleId} ${descriptionId}`}
                onClick={() => navigate(mod.path)}
                className="menu-module__action"
              />
            </motion.div>
          );
        })}
      </div>

      <motion.button
        type="button"
        onClick={() => navigate("/facilitator")}
        className="paper-card bg-warm-card mt-7 flex min-h-[76px] w-full max-w-[1160px] cursor-pointer flex-col items-center justify-center px-6 py-4 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <span className="flex items-center gap-2 text-lg font-bold">
          <svg
            aria-hidden="true"
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="5" width="16" height="11" rx="2" />
            <path d="M8 19h8M12 16v3M8 9l4 2.5L8 14V9Z" />
          </svg>
          宣導帶領模式
        </span>
        <span className="text-text-light mt-1 text-sm">投影教學，可直接選擇單元與題目</span>
      </motion.button>

      <motion.button
        type="button"
        onClick={() => navigate("/")}
        className="text-text-light hover:text-primary mt-6 cursor-pointer px-6 py-3 text-sm transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        ← 回到首頁
      </motion.button>
    </div>
  );
}
