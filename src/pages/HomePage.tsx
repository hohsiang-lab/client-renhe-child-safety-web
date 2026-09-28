import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useAudioContext } from "../hooks/useAudioContext";

const homeModules = [
  { name: "秘密遊戲", description: "學習分辨好秘密和壞秘密", path: "/secret-game" },
  { name: "身體紅綠燈", description: "認識身體的安全界線", path: "/body-traffic-light" },
  { name: "信任大人", description: "認識可能協助你的大人", path: "/trusted-adult" },
  { name: "網路安全", description: "認識網路誘惑，學會安全求助", path: "/network-safety" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { isMuted, currentAudioRef, setCurrentCaption } = useAudioContext();
  const prefersReducedMotion = useReducedMotion() ?? false;

  function handleStart() {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    const audio = new Audio("/audio/home-welcome.mp3");
    audio.muted = isMuted;
    currentAudioRef.current = audio;
    setCurrentCaption("一起來學習怎麼保護自己吧！");
    audio.play().catch(() => {});

    navigate("/menu");
  }

  return (
    <div className="flex min-h-dvh items-start justify-center px-3 md:px-0">
      <motion.main
        data-testid="homepage-hero"
        className="homepage-hero paper-card relative grid w-full grid-cols-1 items-center overflow-hidden"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.45 }}
      >
        <div
          data-testid="homepage-intro"
          className="homepage-intro relative z-10 flex flex-col"
        >
          <h1 aria-label="保護自己大冒險" className="homepage-title font-bold text-text-main">
            <span data-testid="homepage-title-line-1">保護自己</span>
            <span className="block text-[var(--paper-purple)]" data-testid="homepage-title-line-2">大冒險</span>
          </h1>
          <p className="homepage-lead text-text-light">
            一起來學習怎麼保護自己吧！
          </p>
          <nav aria-label="遊戲單元入口" className="homepage-topics grid w-full grid-cols-2">
            {homeModules.map((module) => (
              <Link
                key={module.path}
                to={module.path}
                className="homepage-topic flex min-w-0 flex-col justify-center text-left text-text-main transition-colors hover:bg-white"
              >
                <span className="homepage-topic__title">{module.name}</span>
                <span className="homepage-topic__description text-text-light">{module.description}</span>
              </Link>
            ))}
          </nav>
          <motion.button
            data-testid="homepage-start"
            type="button"
            onClick={handleStart}
            className="homepage-start paper-card cursor-pointer font-bold"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          >
            開始探險
          </motion.button>
        </div>

        <div
          data-testid="homepage-characters"
          className="homepage-characters relative flex items-center justify-center gap-3 overflow-hidden"
        >
          <div
            data-testid="homepage-avatar-male"
            className="homepage-avatar relative z-10 overflow-hidden"
          >
            <img
              src="/images/homepage-boy-upper-body-transparent.png"
              alt="男生人偶頭像"
              draggable={false}
              className="absolute inset-0 size-full object-contain"
            />
          </div>
          <div
            data-testid="homepage-avatar-female"
            className="homepage-avatar relative z-10 overflow-hidden"
          >
            <img
              src="/images/homepage-girl-upper-body-transparent.png"
              alt="女生人偶頭像"
              draggable={false}
              className="absolute inset-0 size-full object-contain"
            />
          </div>
        </div>
      </motion.main>
    </div>
  );
}
