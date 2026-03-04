import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersKeys } from "./useUsersList";
import { usersUseCases } from "./users.use-cases";
import type { UpdateUserSchema } from "../_usecases/users.validations";
import { toast } from "react-toastify";
import { UserDetailKeys } from "./useGetUserDetail";
import { useTranslation } from "react-i18next";

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("users");

  return useMutation({
    mutationFn: ({
      userId,
      formData,
    }: {
      userId: string;
      formData: UpdateUserSchema;
    }) => usersUseCases.update(userId, formData),
    onSuccess: (_, { userId }) => {
      toast.success(t("updateSuccess"));
      queryClient.invalidateQueries({ queryKey: UsersKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: UserDetailKeys.Detail(userId),
      });
    },
  });
};
