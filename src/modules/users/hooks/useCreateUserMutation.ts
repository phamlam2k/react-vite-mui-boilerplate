import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateUserSchema } from "../_usecases/users.validations";
import { usersUseCases } from "./users.use-cases";
import { UsersKeys } from "./useUsersList";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("users");

  return useMutation({
    mutationFn: (formData: CreateUserSchema & { tenantId: string }) =>
      usersUseCases.create(formData),
    onSuccess: () => {
      toast.success(t("createSuccess"));
      queryClient.invalidateQueries({ queryKey: UsersKeys.lists() });
    },
  });
}
