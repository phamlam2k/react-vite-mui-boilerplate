import type { RouteObject } from "react-router";
import DashboardPage from "../pages/DashboardPage";
import DashboardUrls from "./path";

const dashboardRoute: RouteObject = {
  path: DashboardUrls.ROOT,
  element: <DashboardPage />,
};

export default dashboardRoute;
