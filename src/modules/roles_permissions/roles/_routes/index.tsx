import RolesPermissionsUrls from "../../_routes/paths";
import RolesManagementPage from "../pages/RolesManagementPage";

const rolesRoute = {
  path: RolesPermissionsUrls.ROLES,
  element: <RolesManagementPage />,
  meta: {
    label: "Vai trò",
    showInMenu: true,
    order: 2,
  },
};

export default rolesRoute;
