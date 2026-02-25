import { useQuery } from "@tanstack/react-query";
import type { UsersFilters } from "../_domain/users.model";
import { getUsersListUseCase } from "../_usecases/list/list.usecase";

export const UsersKeys = {
  all: ["users"] as const,
  lists: () => [...UsersKeys.all, "list"] as const,
  list: (filters: UsersFilters) => [...UsersKeys.lists(), filters] as const,
};

export function useUsersList(filters: UsersFilters) {
  return useQuery({
    queryKey: UsersKeys.list(filters),
    queryFn: () => getUsersListUseCase(filters),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}
