/**
 * 🟡 ADAPTER LAYER - React Hook
 * Uses EmployeesUseCases (class) with injected gateway.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateEmployeeSchema } from "@modules/employees/_usecases/employees.validations";
import { EmployeesKeys } from "./useEmployeesList";
import { toast } from "react-toastify";
import { employeesUseCases } from "./employees.use-cases";

export function useCreateEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: CreateEmployeeSchema) =>
      employeesUseCases.create(formData),
    onSuccess: () => {
      toast.success("Nhân viên đã được tạo thành công");
      queryClient.invalidateQueries({ queryKey: EmployeesKeys.lists() });
    },
  });
}
