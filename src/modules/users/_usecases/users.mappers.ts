import type {
  UserProfile,
  UserListRequest,
  UserCreateRequest,
  UserUpdateRequestBody,
} from "@modules/users/_api/users.type";
import type { User, UsersFilters } from "@modules/users/_domain/users.model";
import { ROLE_LABELS } from "@modules/users/_domain/users.rules";
import type { CreateUserSchema, UpdateUserSchema } from "./users.validations";
import { omit } from "lodash-es";

export function mapFiltersToApiParams(filters: UsersFilters): UserListRequest {
  const params: UserListRequest = {
    page: filters.page,
    pageSize: filters.pageSize,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };
  if (filters.search && filters.search.trim())
    params.search = filters.search.trim();
  if (filters.role && filters.role !== "all") params.role = filters.role;
  if (typeof filters.isActive === "boolean") params.isActive = filters.isActive;
  return params;
}

export function mapUserProfileToUser(profile: UserProfile): User {
  return {
    ...profile,
    fullName: `${profile.firstName} ${profile.lastName}`.trim(),
    displayRole: ROLE_LABELS[profile.role] || profile.role,
  };
}

export function mapUserProfilesToUsers(profiles: UserProfile[]): User[] {
  return profiles.map(mapUserProfileToUser);
}

export function mapCreateUserFormToApi(
  formData: CreateUserSchema & { tenantId?: string }
): UserCreateRequest {
  return omit(formData, ["confirmPassword"]) as UserCreateRequest;
}

export function mapUpdateUserFormToApi(
  userId: string,
  formData: Partial<UpdateUserSchema>
): UserUpdateRequestBody {
  return { userId, data: formData as UserUpdateRequestBody["data"] };
}
