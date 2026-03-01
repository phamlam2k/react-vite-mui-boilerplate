import { useQuery } from "@tanstack/react-query";
import type { RolesFilters } from "@modules/roles_permissions/_domain/roles/roles.model";
import { rolesUseCases } from "./roles.use-cases";

export const RolesKeys = {
  all: ["roles"] as const,
  lists: () => [...RolesKeys.all, "list"] as const,
  list: (filters: RolesFilters) => [...RolesKeys.lists(), filters] as const,
};

export function useRolesList(filters: RolesFilters) {
  return useQuery({
    queryKey: RolesKeys.list(filters),
    queryFn: () => rolesUseCases.getList(filters),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}
