/**
 * 🟡 ADAPTER LAYER - React Hook
 * Injects gateway (rolesApi) into use case; use case depends only on port (inner).
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import rolesApi from "@modules/roles_permissions/_api/roles/roles.api";
import { RolesKeys } from "./useRolesList";
import { RoleDetailKeys } from "./useGetRoleDetail";
import { RolePermissionsKeys } from "./useGetRolePermissions";
import { toast } from "react-toastify";
import { setRolePermissionsUseCase } from "@modules/roles_permissions/_usecases/roles/set-role-permissions/set-role-permissions.usecase";

export function useSetRolePermissionsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roleId,
      permissionIds,
    }: {
      roleId: string;
      permissionIds: string[];
    }) =>
      setRolePermissionsUseCase(
        rolesApi.setRolePermissions,
        roleId,
        permissionIds
      ),
    onSuccess: (_, { roleId }) => {
      toast.success("Quyền đã được cập nhật thành công");
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
