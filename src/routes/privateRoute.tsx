import PrivateLayout from "@core/app-shell/layouts/PrivateLayout";
import { dashboardRoute } from "@core/app-shell/pages";
import { Navigate, type RouteObject } from "react-router";

export const privateRoute: RouteObject = {
  path: "/",
  element: <PrivateLayout />,
  children: [
    {
      index: true,
      element: <Navigate to="/dashboard" replace />,
    },
    dashboardRoute,
  ],
};
