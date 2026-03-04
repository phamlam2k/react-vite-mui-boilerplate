import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RolesKeys } from "./useRolesList";
import { RoleDetailKeys } from "./useGetRoleDetail";
import { RolePermissionsKeys } from "./useGetRolePermissions";
import { toast } from "react-toastify";
import { rolesUseCases } from "./roles.use-cases";
import { useTranslation } from "react-i18next";

export function useSetRolePermissionsMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("roles");

  return useMutation({
    mutationFn: ({
      roleId,
      permissionIds,
    }: {
      roleId: string;
      permissionIds: string[];
    }) => rolesUseCases.setRolePermissions(roleId, permissionIds),
    onSuccess: (_, { roleId }) => {
      toast.success(t("setPermissionsSuccess"));
      queryClient.invalidateQueries({ queryKey: RolesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: RoleDetailKeys.Detail(roleId),
      });
      queryClient.invalidateQueries({
        queryKey: RolePermissionsKeys.List(roleId),
      });
    },
  });
}
