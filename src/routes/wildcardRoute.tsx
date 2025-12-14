import { Navigate, type RouteObject } from "react-router";

export const wildcardRoute: RouteObject = {
  path: "*",
  element: <Navigate to="/404" replace />,
};
