import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { bodyPartsV2 } from "../data/bodyPartsV2";
import {
  useBodyTrafficLightStore,
  type LightColor,
} from "../stores/useBodyTrafficLightStore";

const COLOR_OPTIONS: { color: LightColor; label: string; bg: string }[] = [
  { color: "green", label: "🟢 綠燈", bg: "bg-green-400" },
  { color: "yellow", label: "🟡 黃燈", bg: "bg-yellow-400" },
  { color: "red", label: "🔴 紅燈", bg: "bg-red-400" },
];

const COLOR_OVERLAY: Record<LightColor, string> = {
  green: "bg-green-400/60",
  yellow: "bg-yellow-400/60",
  red: "bg-red-400/60",
};

// Zones sorted largest → smallest so smaller (more specific) zones render on
// top and win click events when bounding boxes overlap (Live2D priority rule).
const sortedZones = bodyPartsV2
  .flatMap((part) => part.zones.map((zone, i) => ({ part, zone, zoneIdx: i })))
  .sort((a, b) => b.zone.w * b.zone.h - a.zone.w * a.zone.h);

export default function BodyMarkPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { doll, setDoll, marks, setMark } = useBodyTrafficLightStore();

  // Support direct navigation / E2E via ?doll= URL param
  useEffect(() => {
    const param = searchParams.get("doll");
    if (param === "male") setDoll("male");
    else setDoll("female");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

  const isComplete = Object.keys(marks).length === bodyPartsV2.length;
  const selectedColor = selectedPartId
    ? (marks[selectedPartId] as LightColor | undefined)
    : undefined;

  function handleColorPick(color: LightColor) {
    if (!selectedPartId) return;
    setMark(selectedPartId, color);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center bg-pink-50 pb-44">
      <div className="w-full max-w-[360px] px-4 pt-8">
        <h1 className="mb-2 text-center text-xl font-bold text-gray-800">
          幫身體各部位選燈色 🚦
        </h1>
        <p className="mb-4 text-center text-sm text-gray-500">
          已標記 {Object.keys(marks).length} / {bodyPartsV2.length} 個部位
        </p>

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
            const isSelected = selectedPartId === part.id;
            const side =
              part.zones.length > 1
                ? zoneIdx === 0
                  ? "（左）"
                  : "（右）"
                : "";

            let overlayClass =
              "border-white/60 bg-transparent hover:bg-white/20";
            if (isSelected && color) {
              overlayClass = `border-white ${COLOR_OVERLAY[color]}`;
            } else if (isSelected) {
              overlayClass = "border-white bg-white/40";
            } else if (color) {
              overlayClass = `border-transparent ${COLOR_OVERLAY[color]}`;
            }

            return (
              <button
                key={`${part.id}-${zoneIdx}`}
                aria-label={`${part.name}${side}`}
                aria-pressed={isSelected}
                data-part-id={part.id}
                data-color={color ?? ""}
                onClick={() => setSelectedPartId(part.id)}
                className={`absolute rounded-xl border-2 transition-all ${overlayClass}`}
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
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 flex flex-col items-center gap-2 bg-white/95 px-6 pb-6 pt-4 shadow-[0_-2px_16px_rgba(0,0,0,0.08)] backdrop-blur-sm">
        <AnimatePresence>
          {isComplete && (
            <motion.button
              data-testid="complete-btn"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={() => navigate("/body-traffic-light")}
              className="w-full max-w-xs rounded-full bg-green-500 py-3 text-lg font-bold text-white shadow-lg"
            >
              完成設定 ✅
            </motion.button>
          )}
        </AnimatePresence>

        {selectedPartId && (
          <p className="text-sm font-medium text-gray-600">
            已選：
            <span className="font-bold text-gray-900">
              {bodyPartsV2.find((p) => p.id === selectedPartId)?.name}
            </span>
          </p>
        )}

        <div className="flex gap-3">
          {COLOR_OPTIONS.map(({ color, label, bg }) => {
            const isActive = selectedColor === color;
            return (
              <button
                key={color}
                onClick={() => handleColorPick(color)}
                disabled={!selectedPartId}
                className={[
                  "rounded-full px-4 py-3 text-sm font-bold text-white transition-all",
                  bg,
                  isActive ? "scale-110 shadow-lg" : "opacity-80",
                  !selectedPartId
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-pointer",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
