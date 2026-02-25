/**
 * 🟢 USE CASE LAYER - Data Mappers
 * Transform between domain models and DTOs
 */

import type { UserProfile, UserListRequest } from "../../_api/users.type";
import type { User, UsersFilters } from "../../_domain/users.model";
import { ROLE_LABELS } from "../../_domain/users.rules";

/**
 * Map domain filters to API request params
 */
export function mapFiltersToApiParams(
  filters: UsersFilters
): UserListRequest {
  const params: UserListRequest = {
    page: filters.page,
    pageSize: filters.pageSize,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };

  if (filters.search && filters.search.trim()) {
    params.search = filters.search.trim();
  }

  if (filters.role && filters.role !== "all") {
    params.role = filters.role;
  }

  if (typeof filters.isActive === "boolean") {
    params.isActive = filters.isActive;
  }

  return params;
}

/**
 * Map API UserProfile to Domain User model
 */
export function mapUserProfileToUser(profile: UserProfile): User {
  return {
    ...profile,
    fullName: `${profile.firstName} ${profile.lastName}`.trim(),
    displayRole: ROLE_LABELS[profile.role] || profile.role,
  };
}

/**
 * Map array of UserProfiles to Users list
 */
export function mapUserProfilesToUsers(profiles: UserProfile[]): User[] {
  return profiles.map(mapUserProfileToUser);
}
