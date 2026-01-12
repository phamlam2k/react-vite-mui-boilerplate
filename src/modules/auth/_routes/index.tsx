import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import AuthLayout from "@core/app-shell/layouts/AuthLayout";
import loginRoute from "../login/_routes";
import AuthUrls from "./path";

export const authRoute: RouteObject = {
  path: AuthUrls.ROOT,
  element: <AuthLayout />,
  children: [
    {
      index: true,
      element: <Navigate to={AuthUrls.LOGIN} replace />,
    },
    loginRoute,
  ],
};
