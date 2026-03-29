import OrgsManagementPage from "../pages/OrgsManagementPage";
import OrganizationsUrls from "./path";
import type { RouteWithMeta } from "@shared/types/route.type";
import BusinessIcon from "@mui/icons-material/Business";

const organizationsRoute: RouteWithMeta = {
  path: OrganizationsUrls.ROOT,
  element: <OrgsManagementPage />,
  meta: {
    label: "Đơn vị",
    icon: <BusinessIcon />,
    showInMenu: true,
    order: 1,
  },
};

export default organizationsRoute;
