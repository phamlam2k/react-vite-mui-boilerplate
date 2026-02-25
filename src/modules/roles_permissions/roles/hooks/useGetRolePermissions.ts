/**
 * 🟡 ADAPTER LAYER - React Hook
 * Injects gateway (rolesApi) into use case; use case depends only on port (inner).
 */

import { useQuery } from "@tanstack/react-query";
import rolesApi from "@modules/roles_permissions/_api/roles/roles.api";
import { getRolePermissionsUseCase } from "@modules/roles_permissions/_usecases/roles/get-role-permissions/get-role-permissions.usecase";

export const RolePermissionsKeys = {
  List: (roleId: string) => ["role-permissions", roleId] as const,
};

export function useGetRolePermissions(roleId: string) {
  return useQuery({
    queryKey: RolePermissionsKeys.List(roleId),
    queryFn: () =>
      getRolePermissionsUseCase(rolesApi.getRolePermissions, roleId),
    enabled: !!roleId,
  });
}
