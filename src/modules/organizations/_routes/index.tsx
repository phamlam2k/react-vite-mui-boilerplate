import OrgsManagementPage from "../pages/OrgsManagementPage";
import OrganizationsUrls from "./path";
import type { RouteWithMeta } from "@shared/types/route.type";
import { Business } from "@mui/icons-material";

const organizationsRoute: RouteWithMeta = {
  path: OrganizationsUrls.ROOT,
  element: <OrgsManagementPage />,
  meta: {
    label: "Đơn vị",
    icon: <Business />,
    showInMenu: true,
    order: 1,
  },
};

export default organizationsRoute;
