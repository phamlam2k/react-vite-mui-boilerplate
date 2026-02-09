import authApi from "@modules/auth/_api/auth.api";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutate = () => {
  const mutate = useMutation({
    mutationFn: authApi.login,
  });

  return mutate;
};
