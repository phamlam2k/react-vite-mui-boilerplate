import authApi from "@modules/auth/_api/auth.api";
import { mapLoginFormToApi } from "./login.mapper";
import { loginSchema, type LoginSchema } from "./login.validation";

export const loginUsecase = async (data: LoginSchema) => {
  const validatedData = loginSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.message);
  }

  const apiRequest = mapLoginFormToApi(validatedData.data);
  const response = await authApi.login(apiRequest);
  return response;
};
