import axiosInstance from "@core/axios";
import { generatePath } from "react-router";
import type { IRolesPort } from "@modules/roles_permissions/_usecases/roles/roles.port";
import type {
  PermissionListResponse,
  RoleCreateRequest,
  RoleListRequest,
  RoleListResponse,
  RolePermissionsUpdateRequest,
  RoleUpdateRequestBody,
} from "./roles.type";
import type { Role } from "./roles.type";

export const RolesApiRoutes = {
  Roles: "/roles",
  RoleById: "/roles/:roleId",
  RolePermissions: "/roles/:roleId/permissions",
} as const;

const rolesApi: IRolesPort = {
  listRoles: async (params: RoleListRequest) => {
    const response = await axiosInstance.get<RoleListResponse>(
      RolesApiRoutes.Roles,
      { params }
    );
    return response.data;
  },

  createRole: async (data: RoleCreateRequest) => {
    const response = await axiosInstance.post<Role>(RolesApiRoutes.Roles, data);
    return response.data;
  },

  getRoleById: async (roleId: string) => {
    const response = await axiosInstance.get<Role>(
      generatePath(RolesApiRoutes.RoleById, { roleId })
    );
    return response.data;
  },

  updateRole: async (payload: RoleUpdateRequestBody) => {
    const response = await axiosInstance.patch<Role>(
      generatePath(RolesApiRoutes.RoleById, { roleId: payload.roleId }),
      payload.data
    );
    return response.data;
  },

  deleteRole: async (roleId: string) => {
    await axiosInstance.delete(
      generatePath(RolesApiRoutes.RoleById, { roleId })
    );
  },

  getRolePermissions: async (roleId: string) => {
    const response = await axiosInstance.get<PermissionListResponse>(
      generatePath(RolesApiRoutes.RolePermissions, { roleId })
    );
    return response.data;
  },

  setRolePermissions: async (
    roleId: string,
    data: RolePermissionsUpdateRequest
  ) => {
    const response = await axiosInstance.put<PermissionListResponse>(
      generatePath(RolesApiRoutes.RolePermissions, { roleId }),
      data
    );
    return response.data;
  },
};

export default rolesApi;
