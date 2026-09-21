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

type CalloutArrowDirection = "right" | "left" | "down";
type CalloutArrowSize = "small" | "medium" | "large";

type CalloutArrowSpec = {
  direction: CalloutArrowDirection;
  angle: number;
  size: CalloutArrowSize;
  alignment: "justify-start" | "justify-end" | "justify-center";
};

const CALLOUT_ARROW_SCALE: Record<CalloutArrowSize, number> = {
  small: 0.72,
  medium: 0.92,
  large: 1.12,
};

function OutlinedCalloutArrow({
  angle,
  size,
}: {
  angle: number;
  size: CalloutArrowSize;
}) {
  return (
    <svg
      viewBox="0 0 64 48"
      className="shrink-0"
      style={{
        filter: "drop-shadow(0 1px 1px rgb(15 23 42 / 0.25))",
        height: "clamp(1.125rem, 6vw, 2.5rem)",
        transform: `rotate(${angle}deg) scale(${CALLOUT_ARROW_SCALE[size]})`,
        transformOrigin: "center",
        width: "clamp(1.5rem, 8vw, 3.5rem)",
      }}
      aria-hidden="true"
    >
      <path
        d="M4 18C14 18 22 19 30 18V6l30 18-30 18V30C21 29 14 30 4 30c-3-4-3-8 0-12Z"
        fill="none"
        stroke="#111827"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getCalloutArrowSpec(
  partId: string,
  isLeftZone: boolean,
): CalloutArrowSpec {
  if (partId === "head") {
    return { direction: "down", angle: 55, size: "large", alignment: "justify-center" };
  }
  if (partId === "face") {
    return { direction: "right", angle: -35, size: "small", alignment: "justify-start" };
  }
  if (partId === "mouth") {
    return { direction: "left", angle: 205, size: "small", alignment: "justify-end" };
  }
  if (partId === "chest") {
    return { direction: "left", angle: 160, size: "medium", alignment: "justify-end" };
  }
  if (partId === "belly") {
    return { direction: "left", angle: 220, size: "medium", alignment: "justify-end" };
  }
  if (partId === "private") {
    return { direction: "down", angle: 90, size: "small", alignment: "justify-center" };
  }
  if (isLeftZone) {
    const angleByPart: Record<string, number> = {
      ear: 12,
      hand: 8,
      shoulder: -10,
      thigh: -8,
    };
    return {
      direction: "right",
      angle: angleByPart[partId] ?? 0,
      size: partId === "hand" || partId === "thigh" ? "medium" : "small",
      alignment: "justify-start",
    };
  }
  const angleByPart: Record<string, number> = {
    ear: 178,
    hand: 195,
    shoulder: 145,
    thigh: 170,
  };
  return {
    direction: "left",
    angle: angleByPart[partId] ?? 180,
    size: partId === "hand" || partId === "thigh" ? "medium" : "small",
    alignment: "justify-end",
  };
}

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
    <div className="flex min-h-dvh flex-col bg-pink-50">
      {/* Header */}
      <div className="px-4 pt-6 text-center">
        <h1 className="text-xl font-bold text-gray-800">幫身體各部位選燈色 🚦</h1>
        <p className="mt-1 text-sm text-gray-500">
          已標記 {Object.keys(marks).length} / {bodyPartsV2.length} 個部位
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-1 items-start gap-2 px-3 pt-4">
        {/* Left: doll image with hit zones */}
        <div className="relative flex-[3]" style={{ userSelect: "none" }}>
          <img
            src={doll === "female" ? "/images/紅綠燈女.png" : "/images/紅綠燈難.png"}
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
            const isLeftZone = zone.cx < 50;
            const arrow = getCalloutArrowSpec(part.id, isLeftZone);

            return (
              <button
                key={`${part.id}-${zoneIdx}`}
                aria-label={`${part.name}${side}`}
                aria-pressed={isSelected}
                data-part-id={part.id}
                data-color={color ?? ""}
                onClick={() => setSelectedPartId(part.id)}
                className={[
                  "absolute flex items-center rounded-xl border-2 transition-all",
                  arrow.alignment,
                  isSelected ? "border-white/80" : "border-transparent",
                  "bg-transparent hover:bg-white/10",
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
              >
                <span
                  data-testid="body-part-arrow"
                  data-arrow-angle={arrow.angle}
                  data-arrow-direction={arrow.direction}
                  data-arrow-fill="transparent"
                  data-arrow-size={arrow.size}
                  data-arrow-style="outlined-callout"
                  className={`flex items-center transition-transform duration-200 ${
                    isSelected ? "scale-110" : "hover:scale-105"
                  }`}
                >
                  <OutlinedCalloutArrow angle={arrow.angle} size={arrow.size} />
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: traffic light color picker */}
        <div className="flex flex-[2] flex-col items-center gap-4 pt-6">
          {/* Selected part name */}
          <div className="min-h-[40px] text-center">
            {selectedPartId ? (
              <p className="text-sm font-medium text-gray-600">
                已選：
                <br />
                <span className="font-bold text-gray-900">
                  {bodyPartsV2.find((p) => p.id === selectedPartId)?.name}
                </span>
              </p>
            ) : (
              <p data-testid="body-mark-instruction" className="text-sm font-semibold text-gray-500">
                先點箭頭，再選燈色
              </p>
            )}
          </div>

          {/* Color buttons */}
          <div className="flex w-full flex-col gap-3">
            {COLOR_OPTIONS.map(({ color, label, bg }) => {
              const isActive = selectedColor === color;
              return (
                <button
                  key={color}
                  onClick={() => handleColorPick(color)}
                  disabled={!selectedPartId}
                  className={[
                    "w-full rounded-full py-3 text-sm font-bold text-white transition-all",
                    bg,
                    isActive ? "scale-105 shadow-lg" : "opacity-80",
                    !selectedPartId
                      ? "cursor-not-allowed opacity-40"
                      : "cursor-pointer hover:brightness-105",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Complete button appears here when all parts marked */}
          <AnimatePresence>
            {isComplete && (
              <motion.button
                data-testid="complete-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={() => navigate("/body-traffic-light/touch-test")}
                className="w-full rounded-full bg-green-500 py-3 text-base font-bold text-white shadow-lg"
              >
                完成設定 ✅
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
