import { useQuery } from "@tanstack/react-query";
import { rolesUseCases } from "./roles.use-cases";

export const RolePermissionsKeys = {
  List: (roleId: string) => ["role-permissions", roleId] as const,
};

export function useGetRolePermissions(roleId: string) {
  return useQuery({
    queryKey: RolePermissionsKeys.List(roleId),
    queryFn: () => rolesUseCases.getRolePermissions(roleId),
    enabled: !!roleId,
  });
}
