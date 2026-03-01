import { useQuery } from "@tanstack/react-query";
import { rolesUseCases } from "./roles.use-cases";

export const RoleDetailKeys = {
  Detail: (roleId: string) => ["role", roleId] as const,
};

export function useGetRoleDetail(roleId: string) {
  return useQuery({
    queryKey: RoleDetailKeys.Detail(roleId),
    queryFn: () => rolesUseCases.getById(roleId),
    enabled: !!roleId,
  });
}
