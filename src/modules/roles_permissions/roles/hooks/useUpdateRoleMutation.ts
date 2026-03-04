import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RolesKeys } from "./useRolesList";
import { RoleDetailKeys } from "./useGetRoleDetail";
import { toast } from "react-toastify";
import type { UpdateRoleSchema } from "@modules/roles_permissions/_usecases/roles/roles.validations";
import { rolesUseCases } from "./roles.use-cases";
import { useTranslation } from "react-i18next";

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("roles");

  return useMutation({
    mutationFn: ({
      roleId,
      formData,
    }: {
      roleId: string;
      formData: Partial<UpdateRoleSchema>;
    }) => rolesUseCases.update(roleId, formData),
    onSuccess: (_, { roleId }) => {
      toast.success(t("updateSuccess"));
      queryClient.invalidateQueries({ queryKey: RolesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: RoleDetailKeys.Detail(roleId),
      });
    },
  });
}
