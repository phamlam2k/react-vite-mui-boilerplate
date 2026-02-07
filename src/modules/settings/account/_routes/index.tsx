import SettingUrls from "../../_routes/path";
import type { RouteObject } from "react-router";
import { AccountSettingPageLazy } from "./lazy";

const accountSettingRoute: RouteObject = {
  path: SettingUrls.ACCOUNT,
  element: <AccountSettingPageLazy />,
};

export default accountSettingRoute;
