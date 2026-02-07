import { Navigate, Outlet, type RouteObject } from "react-router";
import SettingUrls from "./path";
import accountSettingRoute from "../account/_routes";
import colorSettingRoute from "../color/_routes";

export const settingsRoute: RouteObject = {
  path: SettingUrls.ROOT,
  element: <Outlet />,
  children: [
    { index: true, element: <Navigate to={SettingUrls.ACCOUNT} replace /> },
    accountSettingRoute,
    colorSettingRoute,
  ],
};
