import { create, type StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ColorNames, generateRamp } from "@scripts/utils";
import baseColors from "@shared/constants/colors";

const colorDefault = baseColors[ColorNames.Blue];

interface ColorsStore {
  color: Record<number, string>;
  colorKey: string;
  setColor: (color: string) => void;
}

const colorsMiddleware = (f: StateCreator<ColorsStore, [], [], ColorsStore>) =>
  devtools(persist(f, { name: "colorsStore" }));

const useColorsStore = create<ColorsStore>()(
  colorsMiddleware(set => ({
    color: colorDefault,
    colorKey: ColorNames.Blue,
    setColor: (color: string) => {
      const _color =
        baseColors?.[color as keyof typeof baseColors] ?? generateRamp(color);

      set({ color: _color, colorKey: color });
    },
  }))
);

export default useColorsStore;
