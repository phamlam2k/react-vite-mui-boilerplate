import PrivateLayout from "@core/app-shell/layouts/PrivateLayout";
import dashboardRoute from "@modules/dashboard/_routes";
import { settingsRoute } from "@modules/settings/_routes";
import { Navigate, type RouteObject } from "react-router";
import type { RouteWithMeta } from "@shared/types/route.type";
import DashboardUrls from "@modules/dashboard/_routes/path";
import { middleware } from "@core/middlewares";
import { usersRoute } from "@modules/users/_routes";
import { employeesRoute } from "@modules/employees/_routes";
import organizationsRoute from "@modules/organizations/_routes";
import rolesPermissionsRoute from "@modules/roles_permissions/_routes";
import { leaveRoute } from "@modules/leave/_routes";
import { attendanceRoute } from "@modules/attendance/_routes";

/**
 * Private routes - chỉ accessible khi đã authenticated
 */
export const privateRouteChildren: RouteWithMeta[] = [
  dashboardRoute,
  employeesRoute,
  usersRoute,
  organizationsRoute,
  rolesPermissionsRoute,
  leaveRoute,
  attendanceRoute,
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
