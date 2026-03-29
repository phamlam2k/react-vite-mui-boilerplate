import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCorrectionSchema } from "@modules/attendance/_usecases/attendance.validations";
import { attendanceUseCases } from "./attendance.use-cases";
import { AttendanceCorrectionKeys } from "./useAttendanceCorrections";

export function useCreateCorrectionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCorrectionSchema) => attendanceUseCases.createCorrection(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AttendanceCorrectionKeys.lists() });
    },
  });
}
