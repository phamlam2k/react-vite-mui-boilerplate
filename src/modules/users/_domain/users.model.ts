/**
 * 🔵 DOMAIN LAYER - Business Models
 * Pure business entities, no framework dependencies
 */

import type {
  PaginatedResponse,
  PaginatedQueryParams,
} from "@shared/types/pagination.type";

/**
 * Domain model for User (extends DTO with computed properties)
 */
export interface User {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
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
