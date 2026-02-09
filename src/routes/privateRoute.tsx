import PrivateLayout from "@core/app-shell/layouts/PrivateLayout";
import dashboardRoute from "@modules/dashboard/_routes";
import { settingsRoute } from "@modules/settings/_routes";
import { Navigate, type RouteObject } from "react-router";
import type { RouteWithMeta } from "@shared/types/route.type";
import DashboardUrls from "@modules/dashboard/_routes/path";
import { middleware } from "@core/middlewares";

/**
 * Private routes - chỉ accessible khi đã authenticated
 */
export const privateRouteChildren: RouteWithMeta[] = [
  dashboardRoute,
  settingsRoute,
];

export const privateRoute: RouteObject = {
  path: "/",
  middleware: [...middleware],
  element: <PrivateLayout />,
  children: [
    {
      index: true,
      element: <Navigate to={DashboardUrls.ROOT} replace />,
    },
    ...privateRouteChildren,
  ],
};
