/**
 * 🟢 USE CASE LAYER - Port (Interface)
 * Defines what the use cases need from the outside. Gateway (outer) implements this.
 * Use cases depend only on this interface — dependency points INWARD.
 */

import type {
  RoleListRequest,
  RoleListResponse,
  RoleCreateRequest,
  Role,
  RoleUpdateRequestBody,
  PermissionListResponse,
  RolePermissionsUpdateRequest,
} from "@modules/roles_permissions/_api/roles/roles.type";

export interface IRolesPort {
  listRoles(params: RoleListRequest): Promise<RoleListResponse>;
  createRole(data: RoleCreateRequest): Promise<Role>;
  getRoleById(roleId: string): Promise<Role>;
  updateRole(payload: RoleUpdateRequestBody): Promise<Role>;
  deleteRole(roleId: string): Promise<void>;
  getRolePermissions(roleId: string): Promise<PermissionListResponse>;
  setRolePermissions(
    roleId: string,
    data: RolePermissionsUpdateRequest
  ): Promise<PermissionListResponse>;
}
