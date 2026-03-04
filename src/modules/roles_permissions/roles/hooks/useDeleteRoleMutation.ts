import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RolesKeys } from "./useRolesList";
import { toast } from "react-toastify";
import { rolesUseCases } from "./roles.use-cases";
import { useTranslation } from "react-i18next";

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("roles");

  return useMutation({
    mutationFn: (roleId: string) => rolesUseCases.delete(roleId),
    onSuccess: () => {
      toast.success(t("deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: RolesKeys.lists() });
    },
  });
}
