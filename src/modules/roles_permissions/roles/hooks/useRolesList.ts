/**
 * 🟡 ADAPTER LAYER - React Hook
 * Injects gateway (rolesApi) into use case; use case depends only on port (inner).
 */

import { useQuery } from "@tanstack/react-query";
import rolesApi from "@modules/roles_permissions/_api/roles/roles.api";
import type { RolesFilters } from "@modules/roles_permissions/_domain/roles/roles.model";
import { getRolesListUseCase } from "@modules/roles_permissions/_usecases/roles/list-roles/list-roles.usecase";

export const RolesKeys = {
  all: ["roles"] as const,
  lists: () => [...RolesKeys.all, "list"] as const,
  list: (filters: RolesFilters) => [...RolesKeys.lists(), filters] as const,
};

export function useRolesList(filters: RolesFilters) {
  return useQuery({
    queryKey: RolesKeys.list(filters),
    queryFn: () => getRolesListUseCase(rolesApi.listRoles, filters),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}
