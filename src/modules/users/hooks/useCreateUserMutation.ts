import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateUserSchema } from "../_usecases/users.validations";
import { usersUseCases } from "./users.use-cases";
import { UsersKeys } from "./useUsersList";
import { toast } from "react-toastify";

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: CreateUserSchema & { tenantId: string }) =>
      usersUseCases.create(formData),
    onSuccess: () => {
      toast.success("Người dùng đã được tạo thành công");
      queryClient.invalidateQueries({ queryKey: UsersKeys.lists() });
    },
  });
}
