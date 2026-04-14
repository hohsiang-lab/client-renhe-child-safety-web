import { useRef, useCallback, useEffect } from "react";

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
    audio.play().catch(() => {});
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (activeAudio === audioRef.current) activeAudio = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { play, stop };
}
