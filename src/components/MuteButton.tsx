import { useAudioContext } from "../hooks/useAudioContext";

export function MuteButton() {
  const { isMuted, toggleMute } = useAudioContext();

  return (
    <button
      type="button"
      onClick={toggleMute}
      className="fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-gray-100 active:bg-gray-200"
      aria-label={isMuted ? "取消靜音" : "靜音"}
    >
      <span className="text-2xl">{isMuted ? "🔇" : "🔊"}</span>
    </button>
  );
}
