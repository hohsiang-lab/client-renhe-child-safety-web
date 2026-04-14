import { createContext } from "react";

export interface AudioContextValue {
  isMuted: boolean;
  toggleMute: () => void;
  currentAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

export const AudioCtx = createContext<AudioContextValue | null>(null);
