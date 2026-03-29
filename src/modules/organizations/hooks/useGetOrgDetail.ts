import { useQuery } from "@tanstack/react-query";
import { organizationsUseCases } from "./organizations.use-cases";
import { OrgsKeys } from "./useOrgsList";

export function useGetOrgDetail(orgId: string) {
  return useQuery({
    queryKey: OrgsKeys.detail(orgId),
    queryFn: () => organizationsUseCases.getById(orgId),
    enabled: !!orgId,
    staleTime: 30_000,
  });
}
