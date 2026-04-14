import { useContext } from "react";
import { AudioCtx } from "../contexts/audio-context";

export function useAudioContext() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudioContext must be used within AudioProvider");
  return ctx;
}
