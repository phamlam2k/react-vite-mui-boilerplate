import axiosInstance from "@core/axios";
import type { AuthLoginRequest } from "./auth.type";

const authApi = {
  login: async (data: AuthLoginRequest) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  },
};

export default authApi;
