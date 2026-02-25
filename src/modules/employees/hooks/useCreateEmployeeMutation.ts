/**
 * 🟡 ADAPTER LAYER - React Hook
 * Adapts Create Employee Use Case to TanStack Mutation
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateEmployeeSchema } from "../_usecases/create/create.validation";
import { createEmployeeUseCase } from "../_usecases/create/create.usecase";
import { EmployeesKeys } from "./useEmployeesList";
import { toast } from "react-toastify";
import employeesApi from "../_api/employees.api";

export function useCreateEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: CreateEmployeeSchema) =>
      createEmployeeUseCase(employeesApi.createEmployee, formData),
    onSuccess: () => {
      toast.success("Nhân viên đã được tạo thành công");
      queryClient.invalidateQueries({ queryKey: EmployeesKeys.lists() });
    },
  });
}
