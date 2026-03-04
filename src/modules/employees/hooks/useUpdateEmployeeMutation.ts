import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmployeesKeys } from "./useEmployeesList";
import { EmployeeDetailKeys } from "./useGetEmployeeDetail";
import type { UpdateEmployeeSchema } from "@modules/employees/_usecases/employees.validations";
import { toast } from "react-toastify";
import { employeesUseCases } from "./employees.use-cases";
import { useTranslation } from "react-i18next";

export function useUpdateEmployeeMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("employees");

  return useMutation({
    mutationFn: ({
      employeeId,
      formData,
    }: {
      employeeId: string;
      formData: Partial<UpdateEmployeeSchema>;
    }) => employeesUseCases.update(employeeId, formData),
    onSuccess: (_, { employeeId }) => {
      toast.success(t("updateSuccess"));
      queryClient.invalidateQueries({ queryKey: EmployeesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: EmployeeDetailKeys.Detail(employeeId),
      });
    },
  });
}
