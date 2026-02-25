import EmployeesUrls from "./path";
import EmployeesManagementPage from "../pages/EmployeesManagementPage";
import type { RouteWithMeta } from "@shared/types/route.type";
import { BadgeOutlined } from "@mui/icons-material";

export const employeesRoute: RouteWithMeta = {
  path: EmployeesUrls.ROOT,
  element: <EmployeesManagementPage />,
  meta: {
    label: "Nhân sự",
    icon: <BadgeOutlined />,
    showInMenu: true,
    order: 1,
  },
};
