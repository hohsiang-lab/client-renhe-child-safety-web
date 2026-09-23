import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useAudioContext } from "../hooks/useAudioContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { isMuted, currentAudioRef } = useAudioContext();
  const prefersReducedMotion = useReducedMotion() ?? false;

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
    <div className="flex min-h-dvh items-center justify-center px-4 py-20 sm:px-6 md:py-10">
      <motion.main
        data-testid="homepage-hero"
        className="relative grid w-full max-w-[880px] grid-cols-1 items-center gap-6 overflow-hidden rounded-[32px] border border-warm-border/30 bg-white/65 p-6 shadow-[0_24px_64px_rgba(72,54,30,0.08)] sm:p-8 md:grid-cols-[1fr_0.9fr] md:gap-10 md:p-10"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.45 }}
      >
        <div
          data-testid="homepage-intro"
          className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left"
        >
          <div
            aria-hidden="true"
            className="mb-5 flex size-16 items-center justify-center rounded-[22px] border border-warm-border/30 bg-warm-card text-4xl shadow-sm"
          >
            <svg aria-hidden="true" className="size-10" viewBox="0 0 64 64" fill="none">
              <path d="m32 5 7.4 17.2 18.7 1.4-14.3 12.1 4.7 18.4L32 44.2 15.5 54.1l4.7-18.4L5.9 23.6l18.7-1.4L32 5Z" fill="#FFD447" stroke="#E7A522" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 aria-label="保護自己大冒險" className="mb-3 max-w-full text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.2] font-bold tracking-[0.02em] text-text-main">
            <span data-testid="homepage-title-line-1">保護自己</span>
            <span className="block" data-testid="homepage-title-line-2">大冒險</span>
          </h1>
          <p className="text-text-light max-w-[22rem] text-base leading-7 sm:text-lg md:text-xl">
            一起來學習怎麼保護自己吧！
          </p>
        </div>

        <div
          data-testid="homepage-characters"
          className="relative flex min-h-[216px] items-center justify-center gap-3 overflow-hidden rounded-[28px] border border-[#ffe5b3] bg-warm-card p-5 sm:min-h-[236px] sm:gap-4 md:row-span-2 md:min-h-[350px]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-white/35"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-8 top-8 size-3 rounded-full bg-primary/50"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-8 right-8 size-2 rounded-full bg-green-safe-dark/50"
          />
          <div
            data-testid="homepage-avatar-male"
            className="relative z-10 size-24 overflow-hidden sm:size-28 md:size-32"
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
            className="relative z-10 size-24 overflow-hidden sm:size-28 md:size-32"
          >
            <img
              src="/images/homepage-girl-upper-body-transparent.png"
              alt="女生人偶頭像"
              draggable={false}
              className="absolute inset-0 size-full object-contain"
            />
          </div>
        </div>

        <motion.button
          data-testid="homepage-start"
          onClick={handleStart}
          className="bg-primary hover:bg-primary-hover focus-visible:ring-primary focus-visible:ring-offset-warm-bg flex min-h-[60px] w-full cursor-pointer items-center justify-center gap-3 rounded-full px-8 py-4 text-lg font-bold text-white shadow-lg transition-colors focus-visible:ring-4 focus-visible:outline-none md:max-w-[340px] md:text-xl"
          whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
        >
          <span>開始探險</span>
          <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
            <path d="M14.7 4.1c-3.4 1.2-6.2 4-7.4 7.4l5.2 5.2c3.4-1.2 6.2-4 7.4-7.4l.7-5.9-5.9.7Z" fill="#FFF7E7" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="15.8" cy="8.2" r="1.8" fill="#FF9F43" />
            <path d="m7.2 11.8-3.3.8-.8 3.3 5.3-1.1m5.6 1.1-.8 3.3 3.3-.8.8-3.3" fill="#FFD447" stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="m10.1 17.1-1.2 3.7 3.7-1.2" fill="#FFD447" stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </motion.main>
    </div>
  );
}
