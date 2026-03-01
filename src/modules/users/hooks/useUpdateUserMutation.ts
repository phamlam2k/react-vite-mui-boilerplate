import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersKeys } from "./useUsersList";
import { usersUseCases } from "./users.use-cases";
import type { UpdateUserSchema } from "../_usecases/users.validations";
import { toast } from "react-toastify";
import { UserDetailKeys } from "./useGetUserDetail";

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      formData,
    }: {
      userId: string;
      formData: UpdateUserSchema;
    }) => usersUseCases.update(userId, formData),
    onSuccess: (_, { userId }) => {
      toast.success("Người dùng đã được cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: UsersKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: UserDetailKeys.Detail(userId),
      });
    },
  });
};
