import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type DollType = "female" | "male";

const DOLLS: { id: DollType; label: string; src: string; alt: string; bg: string; ring: string }[] = [
  {
    id: "female",
    label: "女生 👧",
    src: "/images/doll-female.svg",
    alt: "女生人偶",
    bg: "bg-pink-50",
    ring: "ring-pink-400",
  },
  {
    id: "male",
    label: "男生 👦",
    src: "/images/doll-male.svg",
    alt: "男生人偶",
    bg: "bg-blue-50",
    ring: "ring-blue-400",
  },
];

export default function PickDollPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<DollType | null>(null);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-10">
      <motion.h1
        className="mb-10 text-2xl font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        選一個你喜歡的人偶
      </motion.h1>

      <div className="grid w-full max-w-lg grid-cols-2 gap-6">
        {DOLLS.map((doll) => {
          const isSelected = selected === doll.id;
          return (
            <motion.button
              key={doll.id}
              data-testid={`doll-card-${doll.id}`}
              aria-pressed={isSelected}
              className={[
                "flex cursor-pointer flex-col items-center rounded-3xl p-4 shadow-md transition-shadow",
                doll.bg,
                isSelected
                  ? `ring-4 ${doll.ring} ring-offset-2`
                  : "ring-2 ring-transparent",
              ].join(" ")}
              whileTap={{ scale: 0.97 }}
              animate={{ scale: isSelected ? 1.04 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => setSelected(doll.id)}
            >
              <img
                src={doll.src}
                alt={doll.alt}
                className="mb-3 h-64 w-full object-contain drop-shadow-md"
              />
              <span className="text-lg font-bold">{doll.label}</span>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        data-testid="confirm-btn"
        className={[
          "mt-12 rounded-full px-12 py-4 text-lg font-bold text-white shadow-lg transition-opacity",
          selected
            ? "cursor-pointer bg-green-500 opacity-100"
            : "cursor-not-allowed bg-gray-400 opacity-50",
        ].join(" ")}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        disabled={!selected}
        onClick={() => {
          if (selected) navigate(`/body-traffic-light/mark?doll=${selected}`);
        }}
      >
        選好了
      </motion.button>
    </div>
  );
}
