import axiosInstance from "@core/axios";

const authApi = {
  getAuthMe: async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },
  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },
};

export default authApi;
