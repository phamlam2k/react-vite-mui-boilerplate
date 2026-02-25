import axiosInstance from "@core/axios";
import type { IPermissionsPort } from "@modules/roles_permissions/_usecases/permissions/permissions.port";
import type {
  PermissionListRequest,
  PermissionListResponse,
} from "./permissions.type";

export const PermissionsApiRoutes = {
  Permissions: "/permissions",
} as const;

const permissionsApi: IPermissionsPort = {
  /** List all permissions (catalog, read-only) */
  listPermissions: async (params?: PermissionListRequest) => {
    const response = await axiosInstance.get<PermissionListResponse>(
      PermissionsApiRoutes.Permissions,
      { params }
    );
    return response.data;
  },
};

export default permissionsApi;
