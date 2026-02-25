import { useQuery } from "@tanstack/react-query";
import type { EmployeesFilters } from "../_domain/employees.model";
import { getEmployeesListUseCase } from "../_usecases/list/list.usecase";

export const EmployeesKeys = {
  all: ["employees"] as const,
  lists: () => [...EmployeesKeys.all, "list"] as const,
  list: (filters: EmployeesFilters) =>
    [...EmployeesKeys.lists(), filters] as const,
};

export function useEmployeesList(filters: EmployeesFilters) {
  return useQuery({
    queryKey: EmployeesKeys.list(filters),
    queryFn: () => getEmployeesListUseCase(filters),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}
