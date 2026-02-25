import { useMutation } from "@tanstack/react-query";
import { loginUsecase } from "@modules/auth/_usecases/login/login.usecase";

export const useLoginMutate = () => {
  return useMutation({
    mutationFn: loginUsecase,
  });
};
