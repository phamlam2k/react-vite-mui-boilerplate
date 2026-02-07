import type { RouteObject } from "react-router";
import SettingUrls from "../../_routes/path";
import { ColorSettingPageLazy } from "./lazy";

const colorSettingRoute: RouteObject = {
  path: SettingUrls.COLOR,
  element: <ColorSettingPageLazy />,
};

export default colorSettingRoute;
