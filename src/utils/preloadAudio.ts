export function preloadAudio(srcs: string[], timeoutMs = 5000): Promise<void[]> {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise<void>((resolve) => {
          const audio = new Audio();
          audio.preload = "auto";
          const timer = setTimeout(() => resolve(), timeoutMs);
          audio.addEventListener("canplaythrough", () => { clearTimeout(timer); resolve(); }, { once: true });
          audio.addEventListener("error", () => { clearTimeout(timer); resolve(); }, { once: true });
          audio.src = src;
        }),
    ),
  );
}
