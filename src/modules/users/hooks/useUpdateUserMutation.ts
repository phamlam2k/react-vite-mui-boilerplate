import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersKeys } from "./useUsersList";
import { updateUserUseCase } from "../_usecases/update-user/update-user.usecase";
import type { UpdateUserSchema } from "../_usecases/update-user/update-user.validation";
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
    }) => updateUserUseCase(userId, formData),
    onSuccess: (_, { userId }) => {
      toast.success("Người dùng đã được cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: UsersKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: UserDetailKeys.Detail(userId),
      });
    },
  });
};
