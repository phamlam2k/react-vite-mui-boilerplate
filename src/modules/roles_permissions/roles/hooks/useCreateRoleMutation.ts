import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RolesKeys } from "./useRolesList";
import { toast } from "react-toastify";
import type { CreateRoleSchema } from "@modules/roles_permissions/_usecases/roles/roles.validations";
import { rolesUseCases } from "./roles.use-cases";

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: CreateRoleSchema) => rolesUseCases.create(formData),
    onSuccess: () => {
      toast.success("Vai trò đã được tạo thành công");
      queryClient.invalidateQueries({ queryKey: RolesKeys.lists() });
    },
  });
}
