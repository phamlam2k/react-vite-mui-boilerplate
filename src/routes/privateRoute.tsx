import PrivateLayout from "@core/app-shell/layouts/PrivateLayout";
import dashboardRoute from "@modules/dashboard/_routes";
import { settingsRoute } from "@modules/settings/_routes";
import { Navigate, type RouteObject } from "react-router";
import DashboardUrls from "@modules/dashboard/_routes/path";
import { middleware } from "@core/middlewares";

export const privateRoute: RouteObject = {
  path: "/",
  middleware: [...middleware],
  element: <PrivateLayout />,
  children: [
    {
      index: true,
      element: <Navigate to={DashboardUrls.ROOT} replace />,
    },
    dashboardRoute,
    settingsRoute,
  ],
};
