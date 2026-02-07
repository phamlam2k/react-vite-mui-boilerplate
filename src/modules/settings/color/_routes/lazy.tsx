import { lazy } from "react";

export const ColorSettingPageLazy = lazy(
  () => import("../pages/ColorSettingPage")
);
