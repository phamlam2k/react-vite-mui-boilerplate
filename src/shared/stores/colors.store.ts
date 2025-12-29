import { create, type StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ColorNames } from "@scripts/utils";

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
    setColors: (colors) => set({ colors }),
  }))
);

export default useColorsStore;
