import { useQuery } from "@tanstack/react-query";
import { leaveUseCases } from "./leave.use-cases";
import { LeaveRequestKeys } from "./useLeaveList";

export function useLeaveDetail(requestId: string) {
  return useQuery({
    queryKey: LeaveRequestKeys.detail(requestId),
    queryFn: () => leaveUseCases.getRequestById(requestId),
    enabled: !!requestId,
    staleTime: 30_000,
  });
}
