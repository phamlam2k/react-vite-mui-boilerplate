import { useMutation } from "@tanstack/react-query";
import { authUseCases } from "./auth.use-cases";
import type { LoginSchema } from "@modules/auth/_usecases/auth.validations";

export const useLoginMutate = () => {
  return useMutation({
    mutationFn: (data: LoginSchema) => authUseCases.login(data),
  });
};
