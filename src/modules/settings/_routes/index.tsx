import { Navigate, Outlet } from "react-router";
import { Settings } from "@mui/icons-material";
import type { RouteWithMeta } from "@shared/types/route.type";
import SettingUrls from "./path";
import accountSettingRoute from "../account/_routes";
import colorSettingRoute from "../color/_routes";

export const settingsRoute: RouteWithMeta = {
  path: SettingUrls.ROOT,
  element: <Outlet />,
  meta: {
    label: "Settings",
    icon: <Settings />,
    showInMenu: true,
    order: 2,
  },
  children: [
    { index: true, element: <Navigate to={SettingUrls.ACCOUNT} replace /> },
    accountSettingRoute,
    colorSettingRoute,
  ],
};
