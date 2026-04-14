export function preloadAudio(srcs: string[]): Promise<void[]> {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise<void>((resolve) => {
          const audio = new Audio();
          audio.preload = "auto";
          audio.addEventListener("canplaythrough", () => resolve(), { once: true });
          audio.addEventListener("error", () => resolve(), { once: true });
          audio.src = src;
        }),
    ),
  );
}
