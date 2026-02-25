import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmployeesKeys } from "./useEmployeesList";
import { EmployeeDetailKeys } from "./useGetEmployeeDetail";
import { updateEmployeeUseCase } from "../_usecases/update-employee/update-employee.usecase";
import type { UpdateEmployeeSchema } from "../_usecases/update-employee/update-employee.validation";
import { toast } from "react-toastify";

export function useUpdateEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      formData,
    }: {
      employeeId: string;
      formData: Partial<UpdateEmployeeSchema>;
    }) => updateEmployeeUseCase(employeeId, formData),
    onSuccess: (_, { employeeId }) => {
      toast.success("Nhân viên đã được cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: EmployeesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: EmployeeDetailKeys.Detail(employeeId),
      });
    },
  });
}
