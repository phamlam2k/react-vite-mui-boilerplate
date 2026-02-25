import UsersUrls from "./path";
import UsersManagementPage from "../pages/UsersManagementPage";
import type { RouteWithMeta } from "@shared/types/route.type";
import { People } from "@mui/icons-material";

export const usersRoute: RouteWithMeta = {
  path: UsersUrls.ROOT,
  element: <UsersManagementPage />,
  meta: {
    label: "Users",
    icon: <People />,
    showInMenu: true,
    order: 2,
  },
};
