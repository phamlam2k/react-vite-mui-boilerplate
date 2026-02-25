/**
 * 🟡 ADAPTER LAYER - React Hook
 * Injects gateway (rolesApi) into use case; use case depends only on port (inner).
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import rolesApi from "@modules/roles_permissions/_api/roles/roles.api";
import { RolesKeys } from "./useRolesList";
import { toast } from "react-toastify";
import { deleteRoleUseCase } from "@modules/roles_permissions/_usecases/roles/delete-role/delete-role.usecase";

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roleId: string) =>
      deleteRoleUseCase(rolesApi.deleteRole, roleId),
    onSuccess: () => {
      toast.success("Vai trò đã được xóa thành công");
      queryClient.invalidateQueries({ queryKey: RolesKeys.lists() });
    },
  });
}
