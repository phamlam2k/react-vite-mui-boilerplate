/**
 * 🟢 USE CASE LAYER - Business Logic (Pure)
 * Orchestrates list users logic WITHOUT framework dependencies
 */

import usersApi from "../../_api/users.api";
import type { UsersFilters, UsersList } from "../../_domain/users.model";
import { mapFiltersToApiParams, mapUserProfilesToUsers } from "./list.mapper";
import { usersFiltersSchema } from "./list.validation";

/**
 * Use Case: Get Users List
 * Pure function that orchestrates the business logic
 *
 * @param filters - User-provided filters
 * @returns Promise of users list with metadata
 */
export async function getUsersListUseCase(
  filters: UsersFilters
): Promise<UsersList> {
  const validatedFilters = usersFiltersSchema.parse(filters);

  const apiParams = mapFiltersToApiParams(validatedFilters);

  const response = await usersApi.getUsersList(apiParams);

  const users = mapUserProfilesToUsers(response.data);

  return {
    data: users,
    meta: response.meta,
  };
}

/**
 * Use Case: Export Users to CSV
 * Example of another use case using same data
 */
export async function exportUsersToCSVUseCase(
  filters: UsersFilters
): Promise<string> {
  const allFilters: UsersFilters = {
    ...filters,
    page: 1,
    pageSize: 1000,
  };

  const usersList = await getUsersListUseCase(allFilters);

  const headers = ["Username", "Email", "Full Name", "Role", "Status"];
  const rows = usersList.data.map(user => [
    user.username,
    user.email,
    user.fullName,
    user.displayRole,
    user.isActive ? "Active" : "Inactive",
  ]);

  const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
  return csv;
}
