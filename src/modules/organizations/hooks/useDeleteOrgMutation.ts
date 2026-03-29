import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { organizationsUseCases } from "./organizations.use-cases";
import { OrgsKeys } from "./useOrgsList";

export function useDeleteOrgMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orgId: string) => organizationsUseCases.delete(orgId),
    onSuccess: () => {
      toast.success("Xóa đơn vị tổ chức thành công");
      queryClient.invalidateQueries({ queryKey: OrgsKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(
        error.message ??
          "Không thể xóa. Đơn vị tổ chức có thể đang có thành viên."
      );
    },
  });
}
