/**
 * 🟢 USE CASE LAYER - Business Logic (Pure)
 * Replace the full set of permissions for a role. Depends only on IRolesPort (inner); gateway is injected by adapter.
 */

import type { IRolesPort } from "@modules/roles_permissions/_usecases/roles/roles.port";
import type { PermissionItem } from "@modules/roles_permissions/_domain/permissions/permissions.model";
import { mapPermissionDtosToDomain } from "../../permissions/list-permissions/list-permissions.mapper";

export async function setRolePermissionsUseCase(
  api: IRolesPort["setRolePermissions"],
  roleId: string,
  permissionIds: string[]
): Promise<PermissionItem[]> {
  const response = await api(roleId, {
    permissionIds,
  });
  return mapPermissionDtosToDomain(response.data);
}
