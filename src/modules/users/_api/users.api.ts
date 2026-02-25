import axiosInstance from "@core/axios";
import type {
  UserCreateRequest,
  UserListRequest,
  UserListResponse,
  UserProfile,
  UserUpdateRequestBody,
} from "./users.type";
import { generatePath } from "react-router";

export const UsersApiRoutes = {
  Users: "/users",
  UserById: "/users/:userId",
} as const;

const usersApi = {
  getUsersList: async (params: UserListRequest) => {
    const response = await axiosInstance.get<UserListResponse>(
      UsersApiRoutes.Users,
      {
        params,
      }
    );
    return response.data;
  },
  createUser: async (data: UserCreateRequest) => {
    const response = await axiosInstance.post<UserProfile>(
      UsersApiRoutes.Users,
      data
    );
    return response.data;
  },
  updateUser: async (data: UserUpdateRequestBody) => {
    const response = await axiosInstance.patch(
      generatePath(UsersApiRoutes.UserById, { userId: data.userId }),
      data.data
    );
    return response.data;
  },
  deleteUser: async (userId: string) => {
    const response = await axiosInstance.delete(
      generatePath(UsersApiRoutes.UserById, { userId })
    );
    return response.data;
  },
  getUserById: async (userId: string) => {
    const response = await axiosInstance.get<UserProfile>(
      generatePath(UsersApiRoutes.UserById, { userId })
    );
    return response.data;
  },
};

export default usersApi;
