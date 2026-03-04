import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RolesKeys } from "./useRolesList";
import { toast } from "react-toastify";
import type { CreateRoleSchema } from "@modules/roles_permissions/_usecases/roles/roles.validations";
import { rolesUseCases } from "./roles.use-cases";
import { useTranslation } from "react-i18next";

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("roles");

  return useMutation({
    mutationFn: (formData: CreateRoleSchema) => rolesUseCases.create(formData),
    onSuccess: () => {
      toast.success(t("createSuccess"));
      queryClient.invalidateQueries({ queryKey: RolesKeys.lists() });
    },
  });
}
