import type { RouteObject } from "react-router";
import SettingUrls from "../../_routes/path";
import ColorSettingPage from "../pages/ColorSettingPage";

const colorSettingRoute: RouteObject = {
  path: SettingUrls.COLOR,
  element: <ColorSettingPage />,
};

export default colorSettingRoute;
