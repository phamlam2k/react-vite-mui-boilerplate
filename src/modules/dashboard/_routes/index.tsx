import { Dashboard } from "@mui/icons-material";
import type { RouteWithMeta } from "@shared/types/route.type";
import DashboardPage from "../pages/DashboardPage";
import DashboardUrls from "./path";

const dashboardRoute: RouteWithMeta = {
  path: DashboardUrls.ROOT,
  element: <DashboardPage />,
  meta: {
    label: "Dashboard",
    icon: <Dashboard />,
    showInMenu: true,
    order: 1,
  },
};

export default dashboardRoute;
