import { create } from "zustand";

export type DollType = "female" | "male";
export type LightColor = "red" | "yellow" | "green";

interface BodyTrafficLightState {
  doll: DollType;
  marks: Record<string, LightColor>;
  setDoll: (doll: DollType) => void;
  setMark: (partId: string, color: LightColor) => void;
  reset: () => void;
}

export const useBodyTrafficLightStore = create<BodyTrafficLightState>(
  (set) => ({
    doll: "female",
    marks: {},
    setDoll: (doll) => set({ doll }),
    setMark: (partId, color) =>
      set((state) => ({ marks: { ...state.marks, [partId]: color } })),
    reset: () => set({ doll: "female", marks: {} }),
  })
);
