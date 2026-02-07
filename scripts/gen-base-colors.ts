// @ts-nocheck
import { ColorNames, generateRamp } from "./utils";
import fs from "fs";

const anchors = {
  [ColorNames.Gray]: "#64748B",
  [ColorNames.Blue]: "#2563EB",
  [ColorNames.Green]: "#059669",
  [ColorNames.Amber]: "#F59E0B",
  [ColorNames.Red]: "#DC2626",
};

const baseColors = Object.fromEntries(
  Object.entries(anchors).map(([name, hex]) => [name, generateRamp(hex)])
);

const content = `
// ⚠️ AUTO-GENERATED – DO NOT EDIT
const baseColors = ${JSON.stringify(baseColors, null, 2)} as const;

export default baseColors;
`;

fs.writeFileSync("src/@themes/colors/base.ts", content);
