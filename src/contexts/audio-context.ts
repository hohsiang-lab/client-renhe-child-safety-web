import { createContext } from "react";

export interface AudioContextValue {
  isMuted: boolean;
  toggleMute: () => void;
  currentAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
  currentCaption: string | null;
  setCurrentCaption: (caption: string | null) => void;
  replayCurrentAudio: () => void;
}

export const AudioCtx = createContext<AudioContextValue | null>(null);
