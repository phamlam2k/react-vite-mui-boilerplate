import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersUseCases } from "./users.use-cases";
import { UsersKeys } from "./useUsersList";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("users");

  return useMutation({
    mutationFn: (userId: string) => usersUseCases.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UsersKeys.lists() });
      toast.success(t("deleteSuccess"));
    },
  });
};

export default useDeleteUserMutation;
