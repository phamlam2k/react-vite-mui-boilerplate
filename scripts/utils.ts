import { parse, converter, clampChroma, formatHex } from "culori";

const toOklch = converter("oklch");
const toRgb = converter("rgb");

export const ColorNames = {
  Gray: "gray",
  Blue: "blue",
  Green: "green",
  Amber: "amber",
  Red: "red",
} as const;

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const LIGHTNESS: Record<number, number> = {
  50: 0.97,
  100: 0.94,
  200: 0.88,
  300: 0.8,
  400: 0.72,
  500: 0.64,
  600: 0.56,
  700: 0.48,
  800: 0.4,
  900: 0.32,
};

function chromaScale(step: number) {
  if (step <= 100) return 0.6;
  if (step <= 200) return 0.75;
  if (step <= 400) return 0.9;
  if (step <= 600) return 1.0;
  if (step <= 700) return 0.9;
  if (step <= 800) return 0.8;
  return 0.7;
}

export function generateRamp(anchorHex: string) {
  const parsed = parse(anchorHex);
  const base = toOklch(parsed!);

  const ramp: Record<number, string> = {};

  for (const step of STEPS) {
    const color = clampChroma(
      {
        mode: "oklch",
        l: LIGHTNESS[step],
        c: (base.c ?? 0) * chromaScale(step),
        h: base.h ?? 0,
      },
      "rgb"
    );

    ramp[step] = formatHex(toRgb(color));
  }

  return ramp;
}
