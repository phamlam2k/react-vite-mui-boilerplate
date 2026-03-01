import { useQuery } from "@tanstack/react-query";
import { permissionsUseCases } from "./permissions.use-cases";

export const PermissionsCatalogKeys = {
  all: ["permissions", "catalog"] as const,
  list: (group?: string) =>
    [...PermissionsCatalogKeys.all, group ?? "all"] as const,
};

export function usePermissionsCatalog(params?: { group?: string }) {
  return useQuery({
    queryKey: PermissionsCatalogKeys.list(params?.group),
    queryFn: () => permissionsUseCases.getCatalog(params),
    staleTime: 5 * 60_000,
  });
}
