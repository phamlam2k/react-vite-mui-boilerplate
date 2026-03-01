import type {
  UserCreateRequest,
  UserListResponse,
  UserListRequest,
  UserProfile,
  UserUpdateRequestBody,
} from "../_api/users.type";

export interface IUsersPort {
  getUsersList(params: UserListRequest): Promise<UserListResponse>;
  createUser(data: UserCreateRequest): Promise<UserProfile>;
  updateUser(data: UserUpdateRequestBody): Promise<UserProfile>;
  deleteUser(userId: string): Promise<void>;
  getUserById(userId: string): Promise<UserProfile>;
}
