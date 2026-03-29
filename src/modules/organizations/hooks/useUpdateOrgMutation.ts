import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { UpdateOrgSchema } from "@modules/organizations/_usecases/organizations.validations";
import { organizationsUseCases } from "./organizations.use-cases";
import { OrgsKeys } from "./useOrgsList";

export function useUpdateOrgMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orgId,
      formData,
    }: {
      orgId: string;
      formData: Partial<UpdateOrgSchema>;
    }) => organizationsUseCases.update(orgId, formData),
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật đơn vị tổ chức thành công");
      queryClient.invalidateQueries({ queryKey: OrgsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: OrgsKeys.detail(variables.orgId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Cập nhật thất bại");
    },
  });
}
