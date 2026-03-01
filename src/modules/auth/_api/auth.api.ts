import axiosInstance from "@core/axios";
import type { IAuthPort } from "../_usecases/auth.port";
import type { AuthLoginRequest } from "./auth.type";

export class AuthApiGateway implements IAuthPort {
  async login(data: AuthLoginRequest) {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  }
}

export const authApiGateway = new AuthApiGateway();
