import { useRef, useCallback, useEffect, useState } from "react";
import { useAudioContext } from "./useAudioContext";

interface PlayOptions {
  onEnd?: () => void;
  caption?: string;
}

export function useAudioPlayer() {
  const { isMuted, currentAudioRef, setCurrentCaption } = useAudioContext();
  const localRef = useRef<HTMLAudioElement | null>(null);
  const onEndRef = useRef<(() => void) | undefined>(undefined);
  const isMutedRef = useRef(isMuted);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);

  const cleanup = useCallback(() => {
    const audio = localRef.current;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      if (currentAudioRef.current === audio) {
        currentAudioRef.current = null;
      }
      localRef.current = null;
    }
    setIsPlaying(false);
    setCurrentSrc(null);
    setCurrentCaption(null);
  }, [currentAudioRef, setCurrentCaption]);

  const play = useCallback(
    (src: string, options?: PlayOptions) => {
      onEndRef.current = options?.onEnd;

      if (currentAudioRef.current && currentAudioRef.current !== localRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      }
      cleanup();
      setCurrentCaption(options?.caption ?? null);

      const audio = new Audio(src);
      audio.muted = isMutedRef.current;
      localRef.current = audio;
      currentAudioRef.current = audio;

      audio.onended = () => {
        if (localRef.current !== audio) return;
        setIsPlaying(false);
        setCurrentSrc(null);
        onEndRef.current?.();
      };

      audio.onerror = () => {
        if (localRef.current !== audio) return;
        setIsPlaying(false);
        setCurrentSrc(null);
        onEndRef.current?.();
      };

      audio.play().then(() => {
        if (localRef.current !== audio) return;
        setIsPlaying(true);
        setCurrentSrc(src);
      }).catch(() => {
        if (localRef.current !== audio) return;
        setIsPlaying(false);
        setCurrentSrc(null);
        onEndRef.current?.();
      });
    },
    [currentAudioRef, cleanup, setCurrentCaption],
  );

  const pause = useCallback(() => {
    if (localRef.current) {
      localRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    onEndRef.current = undefined;
    cleanup();
  }, [cleanup]);

  const resume = useCallback(() => {
    if (localRef.current && localRef.current.paused && localRef.current.currentTime > 0) {
      localRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (localRef.current) {
      localRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    return () => {
      const audio = localRef.current;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        if (currentAudioRef.current === audio) {
          currentAudioRef.current = null;
        }
      }
      setCurrentCaption(null);
    };
  }, [currentAudioRef, setCurrentCaption]);

  return { play, pause, stop, resume, isPlaying, currentSrc };
}
