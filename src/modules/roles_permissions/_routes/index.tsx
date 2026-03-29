import type { RouteWithMeta } from "@shared/types/route.type";
import RolesPermissionsUrls from "./paths";
import { Navigate, Outlet } from "react-router";
import permissionsRoute from "../permissions/_routes";
import rolesRoute from "../roles/_routes";
import SecurityIcon from "@mui/icons-material/Security";

const rolesPermissionsRoute: RouteWithMeta = {
  path: RolesPermissionsUrls.ROOT,
  element: <Outlet />,
  meta: {
    label: "Quyền & Vai trò",
    icon: <SecurityIcon />,
    showInMenu: true,
    order: 3,
  },
  children: [
    {
      index: true,
      element: <Navigate to={RolesPermissionsUrls.PERMISSIONS} replace />,
    },
    permissionsRoute,
    rolesRoute,
  ],
};

export default rolesPermissionsRoute;
