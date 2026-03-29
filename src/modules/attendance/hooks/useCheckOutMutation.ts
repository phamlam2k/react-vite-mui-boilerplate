import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CheckOutSchema } from "@modules/attendance/_usecases/attendance.validations";
import { attendanceUseCases } from "./attendance.use-cases";
import { AttendanceRecordKeys } from "./useAttendanceRecords";

export function useCheckOutMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CheckOutSchema) => attendanceUseCases.checkOut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AttendanceRecordKeys.all });
    },
  });
}
