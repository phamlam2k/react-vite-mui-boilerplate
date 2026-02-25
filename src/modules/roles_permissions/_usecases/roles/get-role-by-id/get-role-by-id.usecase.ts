/**
 * 🟢 USE CASE LAYER - Business Logic (Pure)
 * Get single role by ID. Depends only on IRolesPort (inner); gateway is injected by adapter.
 */

import type { IRolesPort } from "@modules/roles_permissions/_usecases/roles/roles.port";
import type { RoleItem } from "@modules/roles_permissions/_domain/roles/roles.model";
import { mapRoleDtoToDomain } from "../list-roles/list-roles.mapper";

export async function getRoleByIdUseCase(
  api: IRolesPort["getRoleById"],
  roleId: string
): Promise<RoleItem> {
  if (!roleId) throw new Error("Vai trò không tồn tại");

  const response = await api(roleId);
  return mapRoleDtoToDomain(response);
}
