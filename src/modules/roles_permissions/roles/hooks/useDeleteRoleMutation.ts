import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RolesKeys } from "./useRolesList";
import { toast } from "react-toastify";
import { rolesUseCases } from "./roles.use-cases";

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roleId: string) => rolesUseCases.delete(roleId),
    onSuccess: () => {
      toast.success("Vai trò đã được xóa thành công");
      queryClient.invalidateQueries({ queryKey: RolesKeys.lists() });
    },
  });
}
