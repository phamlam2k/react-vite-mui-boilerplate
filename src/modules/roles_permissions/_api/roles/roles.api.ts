/**
 * 🟡 GATEWAY LAYER - HTTP Adapter (Class)
 * Implements IRolesPort.
 */

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

export class RolesApiGateway implements IRolesPort {
  async listRoles(params: RoleListRequest): Promise<RoleListResponse> {
    const response = await axiosInstance.get<RoleListResponse>(
      RolesApiRoutes.Roles,
      { params }
    );
    return response.data;
  }

  async createRole(data: RoleCreateRequest): Promise<Role> {
    const response = await axiosInstance.post<Role>(
      RolesApiRoutes.Roles,
      data
    );
    return response.data;
  }

  async getRoleById(roleId: string): Promise<Role> {
    const response = await axiosInstance.get<Role>(
      generatePath(RolesApiRoutes.RoleById, { roleId })
    );
    return response.data;
  }

  async updateRole(payload: RoleUpdateRequestBody): Promise<Role> {
    const response = await axiosInstance.patch<Role>(
      generatePath(RolesApiRoutes.RoleById, { roleId: payload.roleId }),
      payload.data
    );
    return response.data;
  }

  async deleteRole(roleId: string): Promise<void> {
    await axiosInstance.delete(
      generatePath(RolesApiRoutes.RoleById, { roleId })
    );
  }

  async getRolePermissions(roleId: string): Promise<PermissionListResponse> {
    const response = await axiosInstance.get<PermissionListResponse>(
      generatePath(RolesApiRoutes.RolePermissions, { roleId })
    );
    return response.data;
  }

  async setRolePermissions(
    roleId: string,
    data: RolePermissionsUpdateRequest
  ): Promise<PermissionListResponse> {
    const response = await axiosInstance.put<PermissionListResponse>(
      generatePath(RolesApiRoutes.RolePermissions, { roleId }),
      data
    );
    return response.data;
  }
}

export const rolesApiGateway = new RolesApiGateway();
