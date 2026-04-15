import type { KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { bodyParts } from "../data/bodyParts";

interface BodySvgProps {
  activePart: string | null;
  exploredParts: Set<string>;
  onPartClick: (partId: string) => void;
}

const signalMap = Object.fromEntries(bodyParts.map((p) => [p.id, p.signal]));

function partFill(
  partId: string,
  activePart: string | null,
  exploredParts: Set<string>,
) {
  const signal = signalMap[partId];
  if (activePart === partId)
    return signal === "red"
      ? "var(--color-red-danger)"
      : "var(--color-green-safe)";
  if (exploredParts.has(partId))
    return signal === "red"
      ? "var(--color-red-danger-bg)"
      : "var(--color-green-safe-bg)";
  return "var(--color-warm-muted)";
}

function partStroke(partId: string, activePart: string | null) {
  if (activePart !== partId) return "var(--color-warm-border)";
  const signal = signalMap[partId];
  return signal === "red"
    ? "var(--color-red-danger-dark)"
    : "var(--color-green-safe-dark)";
}

interface PartGroupProps {
  partId: string;
  activePart: string | null;
  exploredParts: Set<string>;
  onPartClick: (partId: string) => void;
  children: React.ReactNode;
}

function PartGroup({
  partId,
  activePart,
  exploredParts,
  onPartClick,
  children,
}: PartGroupProps) {
  const name = bodyParts.find((p) => p.id === partId)!.name;

  function handleKeyDown(e: KeyboardEvent<SVGGElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPartClick(partId);
    }
  }

  return (
    <motion.g
      onClick={() => onPartClick(partId)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="body-part"
      style={{ cursor: "pointer" }}
      whileTap={{ scale: 0.95 }}
      role="button"
      aria-label={name}
    >
      <g
        style={{
          fill: partFill(partId, activePart, exploredParts),
          stroke: partStroke(partId, activePart),
          strokeWidth: activePart === partId ? 3 : 1.5,
        }}
      >
        {children}
      </g>
    </motion.g>
  );
}

export default function BodySvg({
  activePart,
  exploredParts,
  onPartClick,
}: BodySvgProps) {
  return (
    <svg
      viewBox="0 0 200 380"
      role="group"
      aria-label="身體部位互動圖"
      className="mx-auto h-auto w-full max-w-[280px]"
    >
      {/* Head */}
      <PartGroup
        partId="head"
        activePart={activePart}
        exploredParts={exploredParts}
        onPartClick={onPartClick}
      >
        <circle cx={100} cy={45} r={35} />
      </PartGroup>

      {/* Chest */}
      <PartGroup
        partId="chest"
        activePart={activePart}
        exploredParts={exploredParts}
        onPartClick={onPartClick}
      >
        <rect x={60} y={85} width={80} height={70} rx={12} />
      </PartGroup>

      {/* Hands (left + right as one part) */}
      <PartGroup
        partId="hand"
        activePart={activePart}
        exploredParts={exploredParts}
        onPartClick={onPartClick}
      >
        <rect x={20} y={95} width={35} height={55} rx={10} />
        <rect x={145} y={95} width={35} height={55} rx={10} />
      </PartGroup>

      {/* Private */}
      <PartGroup
        partId="private"
        activePart={activePart}
        exploredParts={exploredParts}
        onPartClick={onPartClick}
      >
        <rect x={65} y={160} width={70} height={50} rx={10} />
      </PartGroup>

      {/* Legs (left + right as one part) */}
      <PartGroup
        partId="leg"
        activePart={activePart}
        exploredParts={exploredParts}
        onPartClick={onPartClick}
      >
        <rect x={62} y={215} width={30} height={100} rx={10} />
        <rect x={108} y={215} width={30} height={100} rx={10} />
      </PartGroup>

      {/* Feet (left + right as one part) */}
      <PartGroup
        partId="foot"
        activePart={activePart}
        exploredParts={exploredParts}
        onPartClick={onPartClick}
      >
        <rect x={55} y={315} width={38} height={28} rx={10} />
        <rect x={107} y={315} width={38} height={28} rx={10} />
      </PartGroup>
    </svg>
  );
}
