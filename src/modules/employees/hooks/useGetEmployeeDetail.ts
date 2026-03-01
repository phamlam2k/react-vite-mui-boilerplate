import { useQuery } from "@tanstack/react-query";
import { employeesUseCases } from "./employees.use-cases";

export const EmployeeDetailKeys = {
  Detail: (employeeId: string) => ["employee", employeeId] as const,
};

export function useGetEmployeeDetail(employeeId: string) {
  return useQuery({
    queryKey: EmployeeDetailKeys.Detail(employeeId),
    queryFn: () => employeesUseCases.getById(employeeId),
    enabled: !!employeeId,
  });
}
