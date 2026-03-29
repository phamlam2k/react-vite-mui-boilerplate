import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateLeaveRequestSchema } from "@modules/leave/_usecases/leave.validations";
import { leaveUseCases } from "./leave.use-cases";
import { LeaveRequestKeys } from "./useLeaveList";

export function useCreateLeaveMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeaveRequestSchema) => leaveUseCases.createRequest(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LeaveRequestKeys.lists() });
    },
  });
}
