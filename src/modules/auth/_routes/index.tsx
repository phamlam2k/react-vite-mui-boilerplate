import type { RouteObject } from "react-router";
import { loginRoute } from "../pages";
import { Navigate } from "react-router";
import AuthLayout from "@core/app-shell/layouts/AuthLayout";

export const authRoute: RouteObject = {
  path: "/auth",
  element: <AuthLayout />,
  children: [
    {
      index: true,
      element: <Navigate to="/auth/login" replace />,
    },
    loginRoute,
  ],
};
