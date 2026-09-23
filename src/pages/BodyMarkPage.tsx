import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { bodyPartsV2 } from "../data/bodyPartsV2";
import {
  useBodyTrafficLightStore,
  type DollType,
  type LightColor,
} from "../stores/useBodyTrafficLightStore";

const COLOR_OPTIONS: {
  color: LightColor;
  label: string;
  buttonClassName: string;
  dotClassName: string;
  arrowFill: string;
}[] = [
  {
    color: "green",
    label: "綠燈",
    buttonClassName: "border-green-safe/60 bg-green-safe-bg",
    dotClassName: "bg-green-safe-dark",
    arrowFill: "var(--color-green-safe-bg)",
  },
  {
    color: "yellow",
    label: "黃燈",
    buttonClassName: "border-amber-300 bg-amber-50",
    dotClassName: "bg-amber-500",
    arrowFill: "var(--color-amber-50)",
  },
  {
    color: "red",
    label: "紅燈",
    buttonClassName: "border-red-danger/60 bg-red-danger-bg",
    dotClassName: "bg-red-danger-dark",
    arrowFill: "var(--color-red-danger-bg)",
  },
];

type CalloutArrowDirection = "right" | "left" | "down";
type CalloutArrowSize = "small" | "medium" | "large";

type CalloutArrowSpec = {
  direction: CalloutArrowDirection;
  angle: number;
  size: CalloutArrowSize;
  anchorX: number;
  anchorY: number;
};

const CALLOUT_ARROW_SCALE: Record<CalloutArrowSize, number> = {
  small: 0.72,
  medium: 0.92,
  large: 1.12,
};

function OutlinedCalloutArrow({
  angle,
  size,
  fill,
}: {
  angle: number;
  size: CalloutArrowSize;
  fill: string;
}) {
  return (
    <svg
      viewBox="0 0 64 48"
      className="shrink-0"
      style={{
        filter: "drop-shadow(0 1px 1px rgb(15 23 42 / 0.25))",
        height: "clamp(18px, 2.3vw, 32px)",
        transform: `rotate(${angle}deg) scale(${CALLOUT_ARROW_SCALE[size]})`,
        transformOrigin: "center",
        width: "clamp(24px, 3vw, 42px)",
      }}
      aria-hidden="true"
    >
      <path
        d="M4 18C14 18 22 19 30 18V6l30 18-30 18V30C21 29 14 30 4 30c-3-4-3-8 0-12Z"
        fill={fill}
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
  doll: DollType,
): CalloutArrowSpec {
  if (partId === "head") {
    return {
      direction: "down",
      angle: 55,
      size: "large",
      anchorX: 34,
      anchorY: doll === "female" ? 4 : 7,
    };
  }
  if (partId === "face") {
    return {
      direction: "right",
      angle: 205,
      size: "small",
      anchorX: 55,
      anchorY: 29,
    };
  }
  if (partId === "mouth") {
    return {
      direction: "left",
      angle: 205,
      size: "small",
      anchorX: 63,
      anchorY: 34,
    };
  }
  if (partId === "chest") {
    return {
      direction: "left",
      angle: 0,
      size: "medium",
      anchorX: 39,
      anchorY: 47,
    };
  }
  if (partId === "belly") {
    return {
      direction: "left",
      angle: -20,
      size: "medium",
      anchorX: 45,
      anchorY: 54,
    };
  }
  if (partId === "private") {
    return {
      direction: "down",
      angle: 110,
      size: "small",
      anchorX: 55,
      anchorY: 60,
    };
  }
  if (isLeftZone) {
    const angleByPart: Record<string, number> = {
      ear: 0,
      hand: 15,
      shoulder: -15,
      thigh: 0,
    };
    const anchorByPart: Record<string, { x: number; y: number }> = {
      ear: { x: 20, y: 25 },
      hand: { x: 7, y: 52 },
      shoulder: { x: 30, y: 39 },
      thigh: { x: 35, y: 71 },
    };
    const anchor = anchorByPart[partId] ?? { x: 35, y: 50 };
    return {
      direction: "right",
      angle: angleByPart[partId] ?? 0,
      size: partId === "hand" || partId === "thigh" ? "medium" : "small",
      anchorX: anchor.x,
      anchorY: anchor.y,
    };
  }
  const angleByPart: Record<string, number> = {
    ear: 180,
    hand: 165,
    shoulder: 135,
    thigh: 180,
  };
  const anchorByPart: Record<string, { x: number; y: number }> = {
    ear: { x: 80, y: 25 },
    hand: { x: 93, y: 52 },
    shoulder: { x: 70, y: 39 },
    thigh: { x: 67, y: 71 },
  };
  const anchor = anchorByPart[partId] ?? { x: 65, y: 50 };
  return {
    direction: "left",
    angle: angleByPart[partId] ?? 180,
    size: partId === "hand" || partId === "thigh" ? "medium" : "small",
    anchorX: anchor.x,
    anchorY: anchor.y,
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
    <div className="flex min-h-dvh flex-col items-center bg-warm-bg px-[clamp(14px,3vw,30px)] pb-[34px] pt-6 text-text-main max-[900px]:pt-4 max-[520px]:px-3 max-[520px]:pb-6 max-[520px]:pt-[13px]">
      <header className="mt-[2px] mb-[18px] w-full max-w-[680px] text-center max-[900px]:mb-3 max-[520px]:mb-[14px]">
        <p className="mb-[5px] text-[.78rem] font-extrabold tracking-[.09em] text-amber-800 max-[520px]:mb-[clamp(15px,3.9vw,20px)] max-[520px]:text-[clamp(1.15rem,5.2vw,1.65rem)]">
          身體界線練習
        </p>
        <h1 className="m-0 text-[clamp(1.35rem,2.2vw,1.9rem)] font-bold leading-[1.3] max-[520px]:text-[clamp(2rem,8.8vw,2.9rem)] max-[520px]:leading-[1.15]">
          幫身體各部位選燈色
        </h1>
        <div className="mx-auto mt-[10px] w-full max-w-[430px] max-[520px]:mt-[clamp(13px,3.3vw,17px)]">
          <p className="m-0 text-[.9rem] font-semibold leading-normal text-text-light max-[520px]:text-[clamp(1.5rem,6.2vw,2rem)] max-[520px]:font-bold">
            已標記 {Object.keys(marks).length} / {bodyPartsV2.length} 個部位
          </p>
          <div
            className="mt-2 h-2 w-full overflow-hidden rounded-full bg-warm-muted"
            role="progressbar"
            aria-label="已標記部位"
            aria-valuemin={0}
            aria-valuemax={bodyPartsV2.length}
            aria-valuenow={Object.keys(marks).length}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${(Object.keys(marks).length / bodyPartsV2.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex w-full flex-1 flex-col items-center gap-[15px] max-[520px]:gap-[10px]">
        <div
          className="relative mx-auto w-fit max-w-full select-none rounded-[24px] border border-[#e7ecdf] bg-[#f5f8ef] shadow-sm max-[900px]:rounded-[20px] max-[520px]:rounded-[17px]"
        >
          <img
            src={doll === "female" ? "/images/紅綠燈女.png" : "/images/紅綠燈難.png"}
            alt={doll === "female" ? "女生人偶" : "男生人偶"}
            className="block h-[min(62svh,610px)] w-auto max-w-full rounded-[24px] object-contain max-[900px]:h-[min(59svh,590px)] max-[900px]:rounded-[20px] max-[520px]:h-[min(50svh,430px)] max-[520px]:rounded-[17px]"
            draggable={false}
            data-testid="doll-image"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />

          <div data-testid="body-part-hit-layer" className="absolute inset-0 z-10">
            {sortedZones.map(({ part, zone, zoneIdx }) => {
              const color = marks[part.id] as LightColor | undefined;
              const isSelected = selectedPartId === part.id;
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
                  aria-pressed={isSelected}
                  data-part-id={part.id}
                  data-hit-zone="true"
                  data-color={color ?? ""}
                  onClick={() => setSelectedPartId(part.id)}
                  className={[
                    "absolute flex items-center rounded-xl border-2 transition-all",
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
                />
              );
            })}
          </div>

          <div
            data-testid="body-part-arrow-layer"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20"
          >
            {sortedZones.map(({ part, zone, zoneIdx }) => {
              const isSelected = selectedPartId === part.id;
              const color = marks[part.id] as LightColor | undefined;
              const fill = COLOR_OPTIONS.find((option) => option.color === color)?.arrowFill ?? "none";
              const arrow = getCalloutArrowSpec(part.id, zone.cx < 50, doll);

              return (
                <span
                  key={`${part.id}-${zoneIdx}`}
                  data-testid="body-part-arrow"
                  data-arrow-part-id={part.id}
                  data-arrow-zone-index={zoneIdx}
                  data-arrow-anchor-x={arrow.anchorX}
                  data-arrow-anchor-y={arrow.anchorY}
                  data-arrow-angle={arrow.angle}
                  data-arrow-direction={arrow.direction}
                  data-arrow-fill={color ?? "transparent"}
                  data-arrow-size={arrow.size}
                  data-arrow-style="outlined-callout"
                  className="absolute transition-transform duration-200"
                  style={{
                    left: `${arrow.anchorX}%`,
                    top: `${arrow.anchorY}%`,
                    transform: `translate(-50%, -50%) scale(${isSelected ? 1.1 : 1})`,
                  }}
                >
                  <OutlinedCalloutArrow angle={arrow.angle} size={arrow.size} fill={fill} />
                </span>
              );
            })}
          </div>
        </div>

        <section
          aria-label="部位燈色選擇"
          className="flex w-full max-w-[740px] flex-col items-center rounded-[22px] border border-warm-muted/50 bg-warm-card px-5 pt-4 pb-[18px] shadow-sm max-[900px]:rounded-[20px] max-[900px]:p-[15px] max-[520px]:rounded-[17px] max-[520px]:p-3"
        >
          <div className="w-full text-center">
            <p data-testid="body-mark-instruction" className="mb-[9px] text-sm font-semibold leading-[1.5] text-text-light max-[520px]:mb-1.5 max-[520px]:text-[.85rem]">
              先點箭頭指向的部位，再選燈色
            </p>
            <p data-testid="selected-body-part" aria-live="polite" className="mb-[11px] flex min-h-[25px] items-center justify-center gap-2 text-[.9rem] leading-normal text-text-light max-[520px]:mb-2 max-[520px]:text-[.84rem]">
              目前選取：
              <strong className="ml-1 font-bold text-text-main">
                {selectedPartId
                  ? bodyPartsV2.find((p) => p.id === selectedPartId)?.name
                  : "尚未選擇部位"}
              </strong>
            </p>
          </div>

          <div data-testid="color-picker" className="grid w-full grid-cols-3 gap-3 max-[900px]:gap-2 max-[520px]:gap-1.5">
            {COLOR_OPTIONS.map(({ color, label, buttonClassName, dotClassName }) => {
              const isActive = selectedColor === color;
              return (
                <button
                  key={color}
                  onClick={() => handleColorPick(color)}
                  disabled={!selectedPartId}
                  aria-pressed={isActive}
                  className={[
                    "flex min-h-[60px] w-full flex-row items-center justify-center gap-[9px] rounded-2xl border-2 px-3 py-2.5 text-[.9rem] font-extrabold text-text-main transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary max-[900px]:min-h-[68px] max-[520px]:min-h-[60px] max-[520px]:flex-col max-[520px]:gap-[3px] max-[520px]:px-[3px] max-[520px]:py-2 max-[520px]:text-[.82rem]",
                    buttonClassName,
                    isActive ? "border-primary shadow-md ring-2 ring-primary/20" : "hover:brightness-95",
                    !selectedPartId ? "cursor-not-allowed opacity-80" : "cursor-pointer",
                  ].join(" ")}
                >
                  <span aria-hidden="true" className={`h-[19px] w-[19px] rounded-full max-[520px]:h-[17px] max-[520px]:w-[17px] ${dotClassName}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isComplete && (
              <motion.button
                data-testid="complete-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={() => navigate("/body-traffic-light/touch-test")}
                className="mt-3 min-h-[52px] w-full rounded-[15px] bg-green-safe-dark px-5 py-3 text-base font-bold text-white shadow-md transition-colors hover:brightness-95"
              >
                完成設定
              </motion.button>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
