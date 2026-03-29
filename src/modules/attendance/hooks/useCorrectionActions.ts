import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CorrectionRejectSchema, CorrectionReviewSchema } from "@modules/attendance/_usecases/attendance.validations";
import { attendanceUseCases } from "./attendance.use-cases";
import { AttendanceCorrectionKeys } from "./useAttendanceCorrections";
import { AttendanceRecordKeys } from "./useAttendanceRecords";

function useBaseAction(
  mutFn: (args: { correctionId: string } & Record<string, unknown>) => Promise<unknown>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: mutFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AttendanceCorrectionKeys.all });
      qc.invalidateQueries({ queryKey: AttendanceRecordKeys.all });
    },
  });
}

export function useApproveCorrectionMutation() {
  return useBaseAction(({ correctionId, review }) =>
    attendanceUseCases.approveCorrection(correctionId, review as CorrectionReviewSchema)
  );
}

export function useRejectCorrectionMutation() {
  return useBaseAction(({ correctionId, rejection }) =>
    attendanceUseCases.rejectCorrection(correctionId, rejection as CorrectionRejectSchema)
  );
}
