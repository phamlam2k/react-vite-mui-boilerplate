import { useQuery } from "@tanstack/react-query";
import employeesApi from "../_api/employees.api";
import { mapEmployeeProfileToEmployee } from "../_usecases/list/list.mapper";

export const EmployeeDetailKeys = {
  Detail: (employeeId: string) => ["employee", employeeId] as const,
};

export function useGetEmployeeDetail(employeeId: string) {
  return useQuery({
    queryKey: EmployeeDetailKeys.Detail(employeeId),
    queryFn: async () => {
      const response = await employeesApi.getEmployeeById(employeeId);
      return mapEmployeeProfileToEmployee(response);
    },
    enabled: !!employeeId,
  });
}
