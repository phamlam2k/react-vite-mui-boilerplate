/**
 * 🟡 ADAPTER LAYER - React Hook
 * Injects gateway (rolesApi) into use case; use case depends only on port (inner).
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import rolesApi from "@modules/roles_permissions/_api/roles/roles.api";
import { RolesKeys } from "./useRolesList";
import { RoleDetailKeys } from "./useGetRoleDetail";
import { toast } from "react-toastify";
import type { UpdateRoleSchema } from "@modules/roles_permissions/_usecases/roles/update-role/update-role.validation";
import { updateRoleUseCase } from "@modules/roles_permissions/_usecases/roles/update-role/update-role.usecase";

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roleId,
      formData,
    }: {
      roleId: string;
      formData: Partial<UpdateRoleSchema>;
    }) => updateRoleUseCase(rolesApi.updateRole, roleId, formData),
    onSuccess: (_, { roleId }) => {
      toast.success("Vai trò đã được cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: RolesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: RoleDetailKeys.Detail(roleId),
      });
    },
  });
}
