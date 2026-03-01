import type { IAuthPort } from "./auth.port";
import { mapLoginFormToApi } from "./auth.mappers";
import { loginSchema, type LoginSchema } from "./auth.validations";
import type { AuthLoginResponse } from "@modules/auth/_api/auth.type";

export class AuthUseCases {
  private readonly api: IAuthPort;

  constructor(api: IAuthPort) {
    this.api = api;
  }

  async login(data: LoginSchema): Promise<AuthLoginResponse | null> {
    const validated = loginSchema.parse(data);
    const request = mapLoginFormToApi(validated);
    return this.api.login(request);
  }
}
