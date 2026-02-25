/**
 * Shared Domain Types - Pagination
 * Reusable across all features
 *
 * NOTE: PaginationMeta type is imported from OpenAPI contract
 * If your backend uses different pagination structure, modify this file
 */

import type { components } from "@core/api-contract/openapi";

/**
 * Pagination metadata from OpenAPI contract
 * Re-export for convenience and consistency
 */
export type PaginationMeta = components["schemas"]["PaginationMeta"];

/**
 * Generic paginated response wrapper
 * Matches backend pagination structure
 *
 * @example
 * ```typescript
 * type UsersList = PaginatedResponse<User>;
 * type ProductsList = PaginatedResponse<Product>;
 * ```
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Pagination request params
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * Sorting params (generic for any sortable fields)
 */
export interface SortParams<TSortFields extends string = string> {
  sortBy?: TSortFields;
  sortOrder?: "asc" | "desc";
}

/**
 * Combined pagination + sorting params
 * Use this as base for your filter types
 *
 * @example
 * ```typescript
 * interface UsersFilters extends PaginatedQueryParams<"username" | "email" | "createdAt"> {
 *   search?: string;
 *   role?: "user" | "admin";
 * }
 * ```
 */
export type PaginatedQueryParams<TSortFields extends string = string> =
  PaginationParams & SortParams<TSortFields>;
