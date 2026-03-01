import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RolesKeys } from "./useRolesList";
import { RoleDetailKeys } from "./useGetRoleDetail";
import { toast } from "react-toastify";
import type { UpdateRoleSchema } from "@modules/roles_permissions/_usecases/roles/roles.validations";
import { rolesUseCases } from "./roles.use-cases";

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roleId,
      formData,
    }: {
      roleId: string;
      formData: Partial<UpdateRoleSchema>;
    }) => rolesUseCases.update(roleId, formData),
    onSuccess: (_, { roleId }) => {
      toast.success("Vai trò đã được cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: RolesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: RoleDetailKeys.Detail(roleId),
      });
    },
  });
}
