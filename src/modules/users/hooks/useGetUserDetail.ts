import { useQuery } from "@tanstack/react-query";
import { usersUseCases } from "./users.use-cases";

export const UserDetailKeys = {
  Detail: (userId: string) => ["user", userId] as const,
};

const useGetUserDetail = (userId: string) => {
  return useQuery({
    queryKey: UserDetailKeys.Detail(userId),
    queryFn: () => usersUseCases.getById(userId),
    enabled: !!userId,
  });
};

export default useGetUserDetail;
