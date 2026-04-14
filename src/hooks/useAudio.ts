import { useRef, useCallback } from "react";

let activeAudio: HTMLAudioElement | null = null;

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((src: string) => {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    }
    const audio = new Audio(src);
    audioRef.current = audio;
    activeAudio = audio;
    audio.play().catch(() => {
      // browser autoplay policy — silently ignore
    });
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (activeAudio === audioRef.current) activeAudio = null;
    }
  }, []);

  return { play, stop };
}
