import { QueryClient } from "@tanstack/react-query";

import type { Mode } from "@themes/type";

export type PrimaryColorConfig = {
  name?: string;
  light?: string;
  main: string;
  dark?: string;
};

export type Config = {
  templateName: string;
  settingsCookieName: string;
  mode: Mode;
  layoutPadding: number;
  compactContentWidth: number;
  disableRipple: boolean;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnReconnect: false,
    },
  },
});

// Primary color config object
export const primaryColorConfig: PrimaryColorConfig[] = [
  {
    name: "primary-1",
    light: "#A379FF",
    main: "#FF0084",
    dark: "#E7177B",
  },
];

export const themeConfig: Config = {
  templateName: "React Vite MUI Boilerplate",
  settingsCookieName: "react-vite-mui-boilerplate",
  mode: "light",
  layoutPadding: 24,
  compactContentWidth: 1440,
  disableRipple: false,
};
