import { useAudioContext } from "../hooks/useAudioContext";

export function AudioCaption() {
  const { currentCaption, replayCurrentAudio } = useAudioContext();

  if (!currentCaption) return null;

  return (
    <aside
      aria-label="語音字幕"
      className="paper-card fixed bottom-4 left-3 right-44 z-40 mx-auto flex max-h-[45dvh] max-w-2xl items-center gap-3 overflow-y-auto bg-warm-card px-4 py-3 text-text-main shadow-lg max-[420px]:right-3 max-[420px]:bottom-20 sm:right-48"
    >
      <p
        data-testid="audio-caption"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`語音字幕：${currentCaption}`}
        className="min-w-0 flex-1 whitespace-pre-line text-sm leading-relaxed sm:text-base"
      >
        {currentCaption}
      </p>
      <button
        type="button"
        onClick={replayCurrentAudio}
        aria-label="重播語音"
        className="min-h-12 shrink-0 rounded-xl border-2 border-text-main bg-white px-3 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        重播
      </button>
    </aside>
  );
}