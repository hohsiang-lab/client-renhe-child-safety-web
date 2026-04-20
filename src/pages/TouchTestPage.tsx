import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { bodyPartsV2 } from "../data/bodyPartsV2";
import {
  useBodyTrafficLightStore,
  type LightColor,
} from "../stores/useBodyTrafficLightStore";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

const COLOR_OVERLAY: Record<LightColor, string> = {
  green: "bg-green-400/60",
  yellow: "bg-yellow-400/60",
  red: "bg-red-400/60",
};

const COLOR_PULSE: Record<LightColor, string> = {
  green: "bg-green-400",
  yellow: "bg-yellow-400",
  red: "bg-red-400",
};

const AUDIO_MAP: Record<LightColor, string> = {
  red: "/audio/red-response.mp3",
  yellow: "/audio/yellow-response.mp3",
  green: "/audio/green-response.mp3",
};

const sortedZones = bodyPartsV2
  .flatMap((part) => part.zones.map((zone, i) => ({ part, zone, zoneIdx: i })))
  .sort((a, b) => b.zone.w * b.zone.h - a.zone.w * a.zone.h);

interface PulseState {
  partId: string;
  color: LightColor;
  key: string;
}

export default function TouchTestPage() {
  const navigate = useNavigate();
  const { doll, marks } = useBodyTrafficLightStore();
  const { play } = useAudioPlayer();
  const [pulseState, setPulseState] = useState<PulseState | null>(null);
  const [playingPartId, setPlayingPartId] = useState<string | null>(null);
  const pulseCounter = useRef(0);

  useEffect(() => {
    if (Object.keys(marks).length === 0) {
      navigate("/body-traffic-light/mark", { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handlePartClick(partId: string) {
    const color = marks[partId] as LightColor | undefined;
    if (!color) return;
    pulseCounter.current += 1;
    setPlayingPartId(partId);
    setPulseState({ partId, color, key: `${partId}-${pulseCounter.current}` });
    play(AUDIO_MAP[color], {
      onEnd: () => setPlayingPartId((prev) => (prev === partId ? null : prev)),
    });
  }

  return (
    <div
      className="flex min-h-dvh flex-col items-center bg-pink-50 pb-24"
      data-testid="touch-test-page"
      data-playing={playingPartId ?? ""}
    >
      <div className="w-full max-w-[360px] px-4 pt-8">
        <h1 className="mb-4 text-center text-xl font-bold text-gray-800">
          點擊各部位，聽聽怎麼說 👂
        </h1>

        <div className="relative mx-auto w-full" style={{ userSelect: "none" }}>
          <img
            src={`/images/doll-${doll}.png`}
            alt={doll === "female" ? "女生人偶" : "男生人偶"}
            className="w-full"
            draggable={false}
            data-testid="doll-image"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />

          {sortedZones.map(({ part, zone, zoneIdx }) => {
            const color = marks[part.id] as LightColor | undefined;
            const side =
              part.zones.length > 1
                ? zoneIdx === 0
                  ? "（左）"
                  : "（右）"
                : "";

            return (
              <button
                key={`${part.id}-${zoneIdx}`}
                aria-label={`${part.name}${side}`}
                data-part-id={part.id}
                onClick={() => handlePartClick(part.id)}
                className={[
                  "absolute rounded-xl border-2 transition-all hover:brightness-110 active:scale-95",
                  color
                    ? `border-transparent ${COLOR_OVERLAY[color]}`
                    : "border-white/60 bg-transparent",
                ].join(" ")}
                style={{
                  left: `${zone.cx}%`,
                  top: `${zone.cy}%`,
                  width: `${zone.w}%`,
                  height: `${zone.h}%`,
                  transform: "translate(-50%, -50%)",
                  minWidth: "48px",
                  minHeight: "48px",
                }}
              />
            );
          })}

          <AnimatePresence>
            {pulseState && (
              <motion.div
                key={pulseState.key}
                className={`pointer-events-none absolute rounded-xl ${COLOR_PULSE[pulseState.color]}`}
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.6 }}
                onAnimationComplete={() => setPulseState(null)}
                style={(() => {
                  const pulsePart = bodyPartsV2.find(
                    (p) => p.id === pulseState.partId,
                  );
                  const zone = pulsePart?.zones[0];
                  if (!zone) return {};
                  return {
                    left: `${zone.cx}%`,
                    top: `${zone.cy}%`,
                    width: `${zone.w}%`,
                    height: `${zone.h}%`,
                    transform: "translate(-50%, -50%)",
                  };
                })()}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <button
        data-testid="done-btn"
        onClick={() => navigate("/ending")}
        className="fixed bottom-6 right-6 rounded-full bg-green-500 px-6 py-3 text-lg font-bold text-white shadow-lg hover:bg-green-600 active:scale-95"
      >
        我學會了！✅
      </button>
    </div>
  );
}
