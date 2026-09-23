import { useAudioContext } from "../hooks/useAudioContext";

export function MuteButton() {
  const { isMuted, toggleMute } = useAudioContext();

  return (
    <button
      type="button"
      onClick={toggleMute}
      className="fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white text-text-main shadow-lg transition-colors hover:bg-gray-100 active:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      aria-label={isMuted ? "取消靜音" : "靜音"}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        {isMuted ? (
          <path d="m16 9 5 6m0-6-5 6" />
        ) : (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </>
        )}
      </svg>
    </button>
  );
}
