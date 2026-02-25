/**
 * 🟡 ADAPTER LAYER - React Hook
 * Injects gateway (permissionsApi) into use case; use case depends only on port (inner).
 */

import permissionsApi from "@modules/roles_permissions/_api/permissions/permissions.api";
import { getPermissionsCatalogUseCase } from "@modules/roles_permissions/_usecases/permissions/list-permissions/list-permissions.usecase";
import { useQuery } from "@tanstack/react-query";

export const PermissionsCatalogKeys = {
  all: ["permissions", "catalog"] as const,
  list: (group?: string) =>
    [...PermissionsCatalogKeys.all, group ?? "all"] as const,
};

export function usePermissionsCatalog(params?: { group?: string }) {
  return useQuery({
    queryKey: PermissionsCatalogKeys.list(params?.group),
    queryFn: () =>
      getPermissionsCatalogUseCase(permissionsApi.listPermissions, params),
    staleTime: 5 * 60_000,
  });
}
