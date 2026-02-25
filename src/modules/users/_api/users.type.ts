import type { components } from "@core/api-contract/openapi";

export type UserCreateRequest = components["schemas"]["UserCreateRequest"];
export type UserListResponse = components["schemas"]["UserListResponse"];
export type UserProfile = components["schemas"]["UserProfile"];
export type UserUpdateRequest = components["schemas"]["UserUpdateRequest"];

/**
 * Query parameters for users list API
 * (Define manually if not in OpenAPI contract)
 */
export type UserListRequest = {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: "user" | "admin";
  isActive?: boolean;
  sortBy?: "username" | "email" | "createdAt" | "lastLoginAt";
  sortOrder?: "asc" | "desc";
};

export type UserUpdateRequestBody = {
  userId: string;
  data: UserUpdateRequest;
};
