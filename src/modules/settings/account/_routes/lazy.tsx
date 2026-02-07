import { lazy } from "react";

export const AccountSettingPageLazy = lazy(
  () => import("../pages/AccountSettingPage")
);
