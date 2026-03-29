import { useQuery } from "@tanstack/react-query";
import { leaveUseCases } from "./leave.use-cases";

export const LeavePolicyKeys = {
  all: ["leave-policies"] as const,
  active: () => [...LeavePolicyKeys.all, "active"] as const,
};

export function useLeavePolicies() {
  return useQuery({
    queryKey: LeavePolicyKeys.active(),
    queryFn: () => leaveUseCases.getPolicies(),
    staleTime: 5 * 60_000,
  });
}
