import type { AuthLoginRequest, AuthLoginResponse } from "../_api/auth.type";

export interface IAuthPort {
  login(data: AuthLoginRequest): Promise<AuthLoginResponse | null>;
}
