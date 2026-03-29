import { useQuery } from "@tanstack/react-query";
import type { AttendanceCorrectionFilters } from "@modules/attendance/_domain/attendance.model";
import { attendanceUseCases } from "./attendance.use-cases";

export const AttendanceCorrectionKeys = {
  all: ["attendance-corrections"] as const,
  lists: () => [...AttendanceCorrectionKeys.all, "list"] as const,
  list: (filters: AttendanceCorrectionFilters) => [...AttendanceCorrectionKeys.lists(), filters] as const,
};

export function useAttendanceCorrections(filters: AttendanceCorrectionFilters) {
  return useQuery({
    queryKey: AttendanceCorrectionKeys.list(filters),
    queryFn: () => attendanceUseCases.getCorrectionList(filters),
    staleTime: 30_000,
  });
}
