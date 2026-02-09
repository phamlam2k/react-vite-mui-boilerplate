import type { AuthLoginRequest } from "@modules/auth/_api/auth.type";
import type { LoginSchema } from "./validations";

export function mapLoginFormToApi(data: LoginSchema): AuthLoginRequest {
  return {
    usernameOrEmail: data.email.trim(),
    password: data.password,
  };
}
