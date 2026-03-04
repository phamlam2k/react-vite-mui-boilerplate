/**
 * 🟡 ADAPTER LAYER - React Hook
 * Uses EmployeesUseCases (class) with injected gateway.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateEmployeeSchema } from "@modules/employees/_usecases/employees.validations";
import { EmployeesKeys } from "./useEmployeesList";
import { toast } from "react-toastify";
import { employeesUseCases } from "./employees.use-cases";
import { useTranslation } from "react-i18next";

export function useCreateEmployeeMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("employees");

  return useMutation({
    mutationFn: (formData: CreateEmployeeSchema) =>
      employeesUseCases.create(formData),
    onSuccess: () => {
      toast.success(t("createSuccess"));
      queryClient.invalidateQueries({ queryKey: EmployeesKeys.lists() });
    },
  });
}
