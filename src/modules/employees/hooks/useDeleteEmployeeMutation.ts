import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEmployeeUseCase } from "../_usecases/delete-employee/delete-employee.usecase";
import { EmployeesKeys } from "./useEmployeesList";
import { toast } from "react-toastify";
import employeesApi from "../_api/employees.api";

export function useDeleteEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string) =>
      deleteEmployeeUseCase(employeesApi.deleteEmployee, employeeId),
    onSuccess: () => {
      toast.success("Nhân viên đã được xóa (chấm dứt) thành công");
      queryClient.invalidateQueries({ queryKey: EmployeesKeys.lists() });
    },
  });
}
