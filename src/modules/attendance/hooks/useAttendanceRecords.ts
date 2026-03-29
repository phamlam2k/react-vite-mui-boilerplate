import { useQuery } from "@tanstack/react-query";
import type { AttendanceRecordFilters } from "@modules/attendance/_domain/attendance.model";
import { attendanceUseCases } from "./attendance.use-cases";

export const AttendanceRecordKeys = {
  all: ["attendance-records"] as const,
  lists: () => [...AttendanceRecordKeys.all, "list"] as const,
  list: (filters: AttendanceRecordFilters) => [...AttendanceRecordKeys.lists(), filters] as const,
};

export function useAttendanceRecords(filters: AttendanceRecordFilters) {
  return useQuery({
    queryKey: AttendanceRecordKeys.list(filters),
    queryFn: () => attendanceUseCases.getRecordList(filters),
    staleTime: 30_000,
    enabled: !!filters.dateFrom && !!filters.dateTo,
  });
}
