/**
 * 🔵 DOMAIN LAYER - Business Models
 * Pure business entities, no framework dependencies
 */

import type { UserProfile } from "../_api/users.type";
import type {
  PaginatedResponse,
  PaginatedQueryParams,
} from "@shared/types/pagination.type";

/**
 * Domain model for User (extends DTO with computed properties)
 */
export interface User extends UserProfile {
  fullName: string;
  displayRole: string;
}

/**
 * Paginated users list
 */
export type UsersList = PaginatedResponse<User>;

/**
 * User filters for list queries
 * Extends shared pagination + sort params with user-specific filters
 */
export interface UsersFilters extends PaginatedQueryParams<
  "username" | "email" | "createdAt" | "lastLoginAt"
> {
  search?: string;
  role?: "user" | "admin" | "all";
  isActive?: boolean | "all";
}
