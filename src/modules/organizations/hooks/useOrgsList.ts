import { useQuery } from "@tanstack/react-query";
import type { OrgsFilters } from "@modules/organizations/_domain/organizations.model";
import { organizationsUseCases } from "./organizations.use-cases";

export const OrgsKeys = {
  all: ["organizations"] as const,
  lists: () => [...OrgsKeys.all, "list"] as const,
  list: (filters: OrgsFilters) => [...OrgsKeys.lists(), filters] as const,
  details: () => [...OrgsKeys.all, "detail"] as const,
  detail: (orgId: string) => [...OrgsKeys.details(), orgId] as const,
  children: (orgId: string) => [...OrgsKeys.all, "children", orgId] as const,
};

export function useOrgsList(filters: OrgsFilters) {
  return useQuery({
    queryKey: OrgsKeys.list(filters),
    queryFn: () => organizationsUseCases.getList(filters),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}
