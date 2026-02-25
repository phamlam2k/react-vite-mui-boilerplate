import { useQuery } from "@tanstack/react-query";
import orgUnitsApi, { type OrgUnitListParams } from "./orgUnits.api";

export const OrgUnitsKeys = {
  all: ["orgUnits"] as const,
  lists: () => [...OrgUnitsKeys.all, "list"] as const,
  list: (params?: OrgUnitListParams) =>
    [...OrgUnitsKeys.lists(), params ?? {}] as const,
};

export function useOrgUnitsList(params?: OrgUnitListParams) {
  return useQuery({
    queryKey: OrgUnitsKeys.list(params),
    queryFn: () => orgUnitsApi.getList(params),
    staleTime: 5 * 60 * 1000,
  });
}
