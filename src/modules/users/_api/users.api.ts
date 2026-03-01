import axiosInstance from "@core/axios";
import { generatePath } from "react-router";
import type { IUsersPort } from "@modules/users/_usecases/users.port";
import type {
  UserCreateRequest,
  UserListRequest,
  UserListResponse,
  UserProfile,
  UserUpdateRequestBody,
} from "./users.type";

export const UsersApiRoutes = {
  Users: "/users",
  UserById: "/users/:userId",
} as const;

export class UsersApiGateway implements IUsersPort {
  async getUsersList(params: UserListRequest): Promise<UserListResponse> {
    const response = await axiosInstance.get<UserListResponse>(
      UsersApiRoutes.Users,
      { params }
    );
    return response.data;
  }

  async createUser(data: UserCreateRequest): Promise<UserProfile> {
    const response = await axiosInstance.post<UserProfile>(
      UsersApiRoutes.Users,
      data
    );
    return response.data;
  }

  async updateUser(data: UserUpdateRequestBody): Promise<UserProfile> {
    const response = await axiosInstance.patch<UserProfile>(
      generatePath(UsersApiRoutes.UserById, { userId: data.userId }),
      data.data
    );
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    await axiosInstance.delete(
      generatePath(UsersApiRoutes.UserById, { userId })
    );
  }

  async getUserById(userId: string): Promise<UserProfile> {
    const response = await axiosInstance.get<UserProfile>(
      generatePath(UsersApiRoutes.UserById, { userId })
    );
    return response.data;
  }
}

export const usersApiGateway = new UsersApiGateway();
