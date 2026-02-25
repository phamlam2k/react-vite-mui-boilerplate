import RolesPermissionsUrls from "../../_routes/paths";
import PermissionsListPage from "../pages/PermissionsListPage";

const permissionsRoute = {
  path: RolesPermissionsUrls.PERMISSIONS,
  element: <PermissionsListPage />,
  meta: {
    label: "Danh mục quyền",
    showInMenu: true,
    order: 1,
  },
};

export default permissionsRoute;
