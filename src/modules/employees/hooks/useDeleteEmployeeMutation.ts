import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmployeesKeys } from "./useEmployeesList";
import { toast } from "react-toastify";
import { employeesUseCases } from "./employees.use-cases";
import { useTranslation } from "react-i18next";

export function useDeleteEmployeeMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("employees");

  return useMutation({
    mutationFn: (employeeId: string) => employeesUseCases.delete(employeeId),
    onSuccess: () => {
      toast.success(t("deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: EmployeesKeys.lists() });
    },
  });
}
