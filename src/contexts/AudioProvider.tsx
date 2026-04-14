import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { AudioCtx } from "./audio-context";

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (currentAudioRef.current) {
        currentAudioRef.current.muted = next;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    let unlocked = false;

    function unlock() {
      if (unlocked) return;
      const a = new Audio();
      a.muted = true;
      a.play().then(() => {
        a.pause();
        unlocked = true;
        document.removeEventListener("click", unlock);
        document.removeEventListener("touchend", unlock);
      }).catch(() => {});
    }

    document.addEventListener("click", unlock, { once: false });
    document.addEventListener("touchend", unlock, { once: false });

    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchend", unlock);
    };
  }, []);

  return (
    <AudioCtx.Provider value={{ isMuted, toggleMute, currentAudioRef }}>
      {children}
    </AudioCtx.Provider>
  );
}
