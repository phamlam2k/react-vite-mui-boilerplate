import { create, type StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ColorNames } from "@scripts/utils";
import baseColors from "@themes/colors/base";

const colorDefault = ColorNames.Blue;

interface ColorsStore {
  colors: string;
  setColors: (colors: string) => void;
}

const colorsMiddleware = (f: StateCreator<ColorsStore, [], [], ColorsStore>) =>
  devtools(persist(f, { name: "colorsStore" }));

const useColorsStore = create<ColorsStore>()(
  colorsMiddleware((set) => ({
    colors: colorDefault,
    setColors: (colors) => {
      set({ colors });
      document.documentElement.style.setProperty(
        "--mui-palette-primary-main",
        baseColors[colors as keyof typeof baseColors][600]
      );

      document.documentElement.style.setProperty(
        "--mui-palette-primary-mainChannel",
        baseColors[colors as keyof typeof baseColors][600]
      );

      document.documentElement.style.setProperty(
        "--mui-palette-primary-hover",
        baseColors[colors as keyof typeof baseColors][700]
      );

      document.documentElement.style.setProperty(
        "--mui-palette-primary-active",
        baseColors[colors as keyof typeof baseColors][800]
      );
    },
  }))
);

export default useColorsStore;
