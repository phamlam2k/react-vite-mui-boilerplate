import { useQuery } from "@tanstack/react-query";
import type { EmployeesFilters } from "@modules/employees/_domain/employees.model";
import { employeesUseCases } from "./employees.use-cases";

export const EmployeesKeys = {
  all: ["employees"] as const,
  lists: () => [...EmployeesKeys.all, "list"] as const,
  list: (filters: EmployeesFilters) =>
    [...EmployeesKeys.lists(), filters] as const,
};

export function useEmployeesList(filters: EmployeesFilters) {
  return useQuery({
    queryKey: EmployeesKeys.list(filters),
    queryFn: () => employeesUseCases.getList(filters),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}
