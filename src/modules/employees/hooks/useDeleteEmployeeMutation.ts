import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmployeesKeys } from "./useEmployeesList";
import { toast } from "react-toastify";
import { employeesUseCases } from "./employees.use-cases";

export function useDeleteEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string) => employeesUseCases.delete(employeeId),
    onSuccess: () => {
      toast.success("Nhân viên đã được xóa (chấm dứt) thành công");
      queryClient.invalidateQueries({ queryKey: EmployeesKeys.lists() });
    },
  });
}
