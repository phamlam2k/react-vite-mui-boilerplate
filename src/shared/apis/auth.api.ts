import axiosInstance from "@core/axios";

const authApi = {
  getAuthMe: async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },
};

export default authApi;
