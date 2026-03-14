import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clearAuthTokens } from "@core/axios";
import authApi from "./auth.api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { syncAuthFromUserProfile } from "@shared/stores/auth.store";

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

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuthTokens();
      queryClient.invalidateQueries({ queryKey: AuthMeKeys.Me() });
      toast.success(t("logoutSuccess"));
      navigate("/login");
      syncAuthFromUserProfile({ id: "", permissions: [] });
    },
    onError: () => {
      toast.error(t("logoutFailed"));
    },
  });
};
