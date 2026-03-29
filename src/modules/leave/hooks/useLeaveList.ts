import { useQuery } from "@tanstack/react-query";
import type { LeaveRequestFilters } from "@modules/leave/_domain/leave.model";
import { leaveUseCases } from "./leave.use-cases";

export const LeaveRequestKeys = {
  all: ["leave-requests"] as const,
  lists: () => [...LeaveRequestKeys.all, "list"] as const,
  list: (filters: LeaveRequestFilters) => [...LeaveRequestKeys.lists(), filters] as const,
  details: () => [...LeaveRequestKeys.all, "detail"] as const,
  detail: (id: string) => [...LeaveRequestKeys.details(), id] as const,
};

export function useLeaveList(filters: LeaveRequestFilters) {
  return useQuery({
    queryKey: LeaveRequestKeys.list(filters),
    queryFn: () => leaveUseCases.getRequestList(filters),
    staleTime: 30_000,
  });
}
