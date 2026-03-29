import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LeaveDecisionSchema } from "@modules/leave/_usecases/leave.validations";
import { leaveUseCases } from "./leave.use-cases";
import { LeaveRequestKeys } from "./useLeaveList";
import { LeaveBalanceKeys } from "./useLeaveBalances";

function useLeaveActionBase(
  mutateFn: (args: { requestId: string } & Record<string, unknown>) => Promise<unknown>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: mutateFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LeaveRequestKeys.all });
      qc.invalidateQueries({ queryKey: LeaveBalanceKeys.all });
    },
  });
}

export function useApproveLeave() {
  return useLeaveActionBase(({ requestId, decision }) =>
    leaveUseCases.approveRequest(requestId, decision as LeaveDecisionSchema)
  );
}

export function useRejectLeave() {
  return useLeaveActionBase(({ requestId, decision }) =>
    leaveUseCases.rejectRequest(requestId, decision as LeaveDecisionSchema)
  );
}

export function useCancelLeave() {
  return useLeaveActionBase(({ requestId, currentUserId }) =>
    leaveUseCases.cancelRequest(requestId, currentUserId as string)
  );
}
