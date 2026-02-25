import { useQuery } from "@tanstack/react-query";
import authApi from "./auth.api";

export const AuthMeKeys = {
  Me: () => ["authMe"] as const,
};

export const useGetAuthMe = () => {
  return useQuery({
    queryKey: AuthMeKeys.Me(),
    queryFn: authApi.getAuthMe,
    staleTime: 5 * 60 * 1000,
  });
};
