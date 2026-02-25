/**
 * 🟡 ADAPTER LAYER - React Hook
 * Injects gateway (rolesApi) into use case; use case depends only on port (inner).
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import rolesApi from "@modules/roles_permissions/_api/roles/roles.api";
import { RolesKeys } from "./useRolesList";
import { toast } from "react-toastify";
import type { CreateRoleSchema } from "@modules/roles_permissions/_usecases/roles/create-role/create-role.validation";
import { createRoleUseCase } from "@modules/roles_permissions/_usecases/roles/create-role/create-role.usecase";

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: CreateRoleSchema) =>
      createRoleUseCase(rolesApi.createRole, formData),
    onSuccess: () => {
      toast.success("Vai trò đã được tạo thành công");
      queryClient.invalidateQueries({ queryKey: RolesKeys.lists() });
    },
  });
}
