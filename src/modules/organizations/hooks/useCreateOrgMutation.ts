import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { CreateOrgSchema } from "@modules/organizations/_usecases/organizations.validations";
import { organizationsUseCases } from "./organizations.use-cases";
import { OrgsKeys } from "./useOrgsList";

export function useCreateOrgMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: CreateOrgSchema) =>
      organizationsUseCases.create(formData),
    onSuccess: () => {
      toast.success("Tạo đơn vị tổ chức thành công");
      queryClient.invalidateQueries({ queryKey: OrgsKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Tạo đơn vị tổ chức thất bại");
    },
  });
}
