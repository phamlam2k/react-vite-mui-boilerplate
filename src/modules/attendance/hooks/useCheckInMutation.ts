import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CheckInSchema } from "@modules/attendance/_usecases/attendance.validations";
import { attendanceUseCases } from "./attendance.use-cases";
import { AttendanceRecordKeys } from "./useAttendanceRecords";

export function useCheckInMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CheckInSchema) => attendanceUseCases.checkIn(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AttendanceRecordKeys.all });
    },
  });
}
