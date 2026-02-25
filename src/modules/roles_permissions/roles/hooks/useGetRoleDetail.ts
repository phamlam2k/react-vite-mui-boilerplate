/**
 * 🟡 ADAPTER LAYER - React Hook
 * Injects gateway (rolesApi) into use case; use case depends only on port (inner).
 */

import { useQuery } from "@tanstack/react-query";
import rolesApi from "@modules/roles_permissions/_api/roles/roles.api";
import { getRoleByIdUseCase } from "@modules/roles_permissions/_usecases/roles/get-role-by-id/get-role-by-id.usecase";

export const RoleDetailKeys = {
  Detail: (roleId: string) => ["role", roleId] as const,
};

export function useGetRoleDetail(roleId: string) {
  return useQuery({
    queryKey: RoleDetailKeys.Detail(roleId),
    queryFn: () => getRoleByIdUseCase(rolesApi.getRoleById, roleId),
    enabled: !!roleId,
  });
}
