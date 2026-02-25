/**
 * 🟢 USE CASE LAYER - Business Logic (Pure)
 * Depends only on IRolesPort (inner); gateway is injected by adapter.
 */

import type { IRolesPort } from "@modules/roles_permissions/_usecases/roles/roles.port";

export async function deleteRoleUseCase(
  api: IRolesPort["deleteRole"],
  roleId: string
): Promise<void> {
  if (!roleId) throw new Error("Vai trò không tồn tại");
  await api(roleId);
}
