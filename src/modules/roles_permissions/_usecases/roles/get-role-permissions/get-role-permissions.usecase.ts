/**
 * 🟢 USE CASE LAYER - Business Logic (Pure)
 * Get all permissions assigned to a role. Depends only on IRolesPort (inner); gateway is injected by adapter.
 */

import type { IRolesPort } from "@modules/roles_permissions/_usecases/roles/roles.port";
import type { PermissionItem } from "@modules/roles_permissions/_domain/permissions/permissions.model";
import { mapPermissionDtosToDomain } from "../../permissions/list-permissions/list-permissions.mapper";

export async function getRolePermissionsUseCase(
  api: IRolesPort["getRolePermissions"],
  roleId: string
): Promise<PermissionItem[]> {
  if (!roleId) throw new Error("Vai trò không tồn tại");

  const response = await api(roleId);
  return mapPermissionDtosToDomain(response.data);
}
