import { useQuery } from "@tanstack/react-query";
import type { AttendanceFilters } from "../_domain/attendance.model";
import { attendanceUseCases } from "./attendance.use-cases";

export const AttendanceKeys = {
  all: ["attendance"] as const,
  lists: () => [...AttendanceKeys.all, "list"] as const,
  list: (filters: AttendanceFilters) => [...AttendanceKeys.lists(), filters] as const,
};

export function useAttendanceList(filters: AttendanceFilters) {
  return useQuery({
    queryKey: AttendanceKeys.list(filters),
    queryFn: () => attendanceUseCases.getList(filters),
    staleTime: 30_000,
  });
}
