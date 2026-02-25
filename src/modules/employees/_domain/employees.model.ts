/**
 * 🔵 DOMAIN LAYER - Business Models
 * Pure business entities, no framework dependencies
 */

import type { EmployeeProfile } from "../_api/employees.type";
import type { PaginatedResponse } from "@shared/types/pagination.type";

/**
 * Domain model for Employee (extends DTO with computed properties)
 */
export interface Employee extends EmployeeProfile {
  fullName: string;
  displayStatus: string;
  displayWorkMode: string;
}

/**
 * Paginated employees list
 */
export type EmployeesList = PaginatedResponse<Employee>;

/**
 * Employee filters for list queries
 */
export interface EmployeesFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  orgUnitId?: string;
  status?: "probation" | "active" | "on_leave" | "terminated" | "all";
  workMode?: "office" | "remote" | "hybrid" | "all";
  managerId?: string;
}
