import { useQuery } from "@tanstack/react-query";
import usersApi from "../_api/users.api";
import { mapUserProfileToUser } from "../_usecases/list/list.mapper";

export const UserDetailKeys = {
  Detail: (userId: string) => ["user", userId] as const,
};

const useGetUserDetail = (userId: string) => {
  return useQuery({
    queryKey: UserDetailKeys.Detail(userId),
    queryFn: () =>
      (async () => {
        const response = await usersApi.getUserById(userId);
        return mapUserProfileToUser(response);
      })(),
    enabled: !!userId,
  });
};

export default useGetUserDetail;
